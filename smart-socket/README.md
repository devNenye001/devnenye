# ⚡ AIoT Smart Socket (Flutter Mobile Client & Firmware)

> **An Intelligent Power-Aware Electrical Socket Using AI and IoT**  
> *Continuous energy telemetry, on-device TinyML anomaly prediction, proactive safety trip cutoff, and voice alerts.*

---

## 📖 Overview

The **AIoT Smart Socket** is an intelligent electrical outlet system built around an **ESP32 microcontroller** and the **PZEM-004T v3.0 energy monitoring module**. Beyond standard remote ON/OFF toggling, it monitors electricity parameters in real-time, models appliance power baselines with lightweight **TinyML inference**, detects wasteful habits (e.g. vampire standby drain or forgotten high-power appliances), and triggers **proactive safety shutdowns with spoken voice alerts** before electrical hazards or thermal damage can occur.

---

## 🛠 Hardware Architecture

- **Microcontroller**: ESP32 Wi-Fi / BLE Dual-Core MCU
- **Power Sensor**: PZEM-004T v3.0 (Measures Voltage, Current, Active Power, Accumulated Energy, Frequency, Power Factor)
- **Actuator**: 5V Optocoupler-Isolated Relay (10A/16A 250V AC)
- **Power Supply**: HLK-PM01 AC-DC 230V-to-5V step-down module
- **Circuit Protection**: Fast-blow fuse & Metal Oxide Varistor (MOV) for surge suppression
- **User Interface**: Manual tactile push-button and status LED

---

## 📱 Mobile Application Architecture (Flutter)

Built with Flutter & Dart, the client connects over **MQTT / WebSockets / HTTP REST** to the ESP32 socket or runs independently via a high-fidelity **hardware simulation engine**.

```
smart-socket/
  ├── firmware/
  │    └── esp32_smart_socket.ino        # ESP32 C++ Arduino firmware for PZEM-004T + Relay
  ├── lib/
  │    ├── main.dart                     # App entry point
  │    ├── app.dart                      # Providers & Theme configuration
  │    ├── core/
  │    │    ├── constants/               # Colors, App constants, MQTT topics
  │    │    ├── theme/                   # High-contrast IoT dark theme
  │    │    └── utils/                   # Unit formatters & Voice feedback
  │    ├── models/
  │    │    ├── power_metrics.dart       # PZEM-004T readings (V, I, P, E, Hz, PF)
  │    │    ├── socket_device.dart       # Device metadata & relay state
  │    │    ├── ai_safety_alert.dart     # Safety events & auto-trip records
  │    │    └── energy_prediction.dart   # TinyML predictions & anomaly scoring
  │    ├── services/
  │    │    ├── esp32_iot_service.dart   # MQTT & REST API communication
  │    │    ├── mock_esp32_simulator.dart# Hardware simulator with realistic noise & faults
  │    │    ├── tinyml_ai_engine.dart    # On-device pattern learning & anomaly detector
  │    │    ├── voice_service.dart       # Spoken voice alerts (Text-to-Speech)
  │    │    ├── notification_service.dart# Push notification alerts
  │    │    └── storage_service.dart     # SharedPreferences persistence
  │    ├── providers/
  │    │    ├── socket_provider.dart     # Relay state, telemetry stream & history
  │    │    ├── ai_analytics_provider.dart# Predictions & anomaly probabilities
  │    │    └── alert_provider.dart      # Hazard logs & voice alert triggers
  │    ├── views/
  │    │    ├── dashboard/               # Big power switch, wattage gauge, 6-parameter grid
  │    │    ├── metrics/                 # Real-time oscilloscope chart (fl_chart)
  │    │    ├── ai_insights/             # Anomaly breakdown, vampire drain, cost forecast
  │    │    ├── alerts/                  # Hazard event logs with voice replay
  │    │    ├── settings/                # Threshold sliders, simulator toggles & MQTT setup
  │    │    └── navigation/              # Main navigation shell
  │    └── widgets/                      # Reusable cards, badges & dialogs
  ├── test/                              # Automated TinyML engine unit tests
  └── pubspec.yaml                       # Packaging & dependencies
```

---

## 📦 Packages & Dependencies

The project includes all required packaging configured in `pubspec.yaml`:

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `provider` | `^6.1.2` | Clean reactive state management |
| `fl_chart` | `^0.69.0` | Real-time oscilloscope waveform & energy graphs |
| `mqtt_client` | `^10.4.0` | Direct MQTT publish/subscribe to ESP32 |
| `http` | `^1.2.2` | REST API fallback to ESP32 local server |
| `web_socket_channel` | `^3.0.1` | Sub-second telemetry duplex streaming |
| `flutter_local_notifications`| `^17.2.3` | Instant background safety warnings |
| `flutter_tts` | `^4.2.0` | Spoken voice alerts when safety shutdowns occur |
| `shared_preferences` | `^2.3.2` | Persistent device configurations & alert logs |
| `intl` | `^0.19.0` | Number, time, and currency formatting |
| `google_fonts` | `^6.2.1` | Modern Inter typography |
| `uuid` | `^4.5.1` | Telemetry record ID generation |

---

## 🚀 Getting Started

### 1. Download Packages
In your terminal, navigate into `smart-socket` and run:
```bash
cd smart-socket
flutter pub get
```

### 2. Run the Application
Launch the app on Chrome, Android Emulator, or connected device:
```bash
flutter run
```

### 3. Simulator & Fault Injection
You can test the application immediately without physical hardware. The built-in simulator provides one-click fault injection buttons on the dashboard:
- **Normal Load**: Typical household lighting and TV (~120W).
- **Space Heater**: Sustained thermal current (~1.9kW, 8.2A).
- **Vampire Drain**: Standby idle leakage detection (~4W).
- **Overload Fault**: Injects a 15A surge to test the **TinyML auto-cutoff relay** and **voice alert**.
- **Voltage Surge**: Injects a 258V surge to test mains overvoltage protection.

---

## 🔌 Hardware Setup (ESP32 + PZEM-004T)

1. Open `firmware/esp32_smart_socket.ino` in Arduino IDE or PlatformIO.
2. Install libraries: `PZEM004Tv30`, `PubSubClient`, `ArduinoJson`.
3. Set your Wi-Fi SSID, Password, and MQTT broker address.
4. Flash to the ESP32.
5. In the Flutter mobile app, enter the ESP32 IP address or connect via MQTT.

