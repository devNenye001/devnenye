/*
 * AIoT Smart Socket ESP32 Firmware
 * Hardware Architecture:
 * - ESP32 DevKit v1
 * - PZEM-004T v3.0 Energy Monitoring Module (UART: RX2=GPIO16, TX2=GPIO17)
 * - 5V Relay Module (IN=GPIO23)
 * - HLK-PM01 AC-DC 5V Power Module
 * - Push Button (GPIO4) & Status LED (GPIO2)
 *
 * Protocols:
 * - Wi-Fi Station
 * - MQTT Client (broker.hivemq.com or custom)
 * - PZEM004Tv30 Modbus RTU interface
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <PZEM004Tv30.h>
#include <ArduinoJson.h>

// Wi-Fi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* device_id = "ESP32_SOCKET_01";

// Topics
const char* topic_telemetry = "aiot/smart_socket/ESP32_SOCKET_01/telemetry";
const char* topic_relay_ctrl = "aiot/smart_socket/ESP32_SOCKET_01/control/relay";
const char* topic_relay_state = "aiot/smart_socket/ESP32_SOCKET_01/state/relay";

// Pin Definitions
#define RELAY_PIN 23
#define BUTTON_PIN 4
#define LED_PIN 2
#define PZEM_RX_PIN 16
#define PZEM_TX_PIN 17

WiFiClient espClient;
PubSubClient client(espClient);
PZEM004Tv30 pzem(Serial2, PZEM_RX_PIN, PZEM_TX_PIN);

bool relayState = true;
unsigned long lastTelemetryTime = 0;
const unsigned long telemetryInterval = 1000; // 1 second update

void setupRelay(bool state) {
  relayState = state;
  digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);
  digitalWrite(LED_PIN, relayState ? HIGH : LOW);
  
  // Publish updated relay state to MQTT
  StaticJsonDocument<128> doc;
  doc["id"] = device_id;
  doc["relay"] = relayState ? "ON" : "OFF";
  char buffer[128];
  serializeJson(doc, buffer);
  client.publish(topic_relay_state, buffer);
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  char message[length + 1];
  for (int i = 0; i < length; i++) {
    message[i] = (char)payload[i];
  }
  message[length] = '\0';

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, message);
  if (!error) {
    if (doc.containsKey("relay")) {
      const char* command = doc["relay"];
      if (strcmp(command, "ON") == 0) {
        setupRelay(true);
      } else if (strcmp(command, "OFF") == 0) {
        setupRelay(false);
      }
    }
  }
}

void reconnectMqtt() {
  while (!client.connected()) {
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      client.subscribe(topic_relay_ctrl);
      setupRelay(relayState);
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  setupRelay(true);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);
}

void loop() {
  if (!client.connected()) {
    reconnectMqtt();
  }
  client.loop();

  // Manual push button toggle
  if (digitalRead(BUTTON_PIN) == LOW) {
    delay(50); // Debounce
    if (digitalRead(BUTTON_PIN) == LOW) {
      setupRelay(!relayState);
      while (digitalRead(BUTTON_PIN) == LOW); // Wait release
    }
  }

  // Publish PZEM-004T telemetry every second
  unsigned long now = millis();
  if (now - lastTelemetryTime >= telemetryInterval) {
    lastTelemetryTime = now;

    float voltage = pzem.voltage();
    float current = pzem.current();
    float power = pzem.power();
    float energy = pzem.energy();
    float frequency = pzem.frequency();
    float pf = pzem.pf();

    if (isnan(voltage)) voltage = 0.0;
    if (isnan(current)) current = 0.0;
    if (isnan(power)) power = 0.0;
    if (isnan(energy)) energy = 0.0;
    if (isnan(frequency)) frequency = 50.0;
    if (isnan(pf)) pf = 1.0;

    StaticJsonDocument<384> doc;
    doc["voltage"] = voltage;
    doc["current"] = current;
    doc["power"] = power;
    doc["energy"] = energy;
    doc["frequency"] = frequency;
    doc["powerFactor"] = pf;

    char buffer[384];
    serializeJson(doc, buffer);
    client.publish(topic_telemetry, buffer);
  }
}

