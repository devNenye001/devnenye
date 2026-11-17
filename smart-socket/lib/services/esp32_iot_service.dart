import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';
import '../models/power_metrics.dart';
import '../core/constants/mqtt_topics.dart';

class Esp32IotService {
  MqttServerClient? _mqttClient;
  bool _isConnected = false;
  bool get isConnected => _isConnected;

  final StreamController<PowerMetrics> _telemetryController =
      StreamController<PowerMetrics>.broadcast();
  Stream<PowerMetrics> get telemetryStream => _telemetryController.stream;

  // Real-time MQTT Connection to ESP32
  Future<bool> connectMqtt({
    required String broker,
    required int port,
    required String socketId,
  }) async {
    final clientIdentifier = 'FlutterApp_${DateTime.now().millisecondsSinceEpoch}';
    _mqttClient = MqttServerClient(broker, clientIdentifier);
    _mqttClient!.port = port;
    _mqttClient!.keepAlivePeriod = 20;
    _mqttClient!.logging(on: false);

    final connMessage = MqttConnectMessage()
        .withClientIdentifier(clientIdentifier)
        .startClean()
        .withWillQos(MqttQos.atLeastOnce);
    _mqttClient!.connectionMessage = connMessage;

    try {
      print('Connecting to MQTT broker: $broker:$port...');
      final status = await _mqttClient!.connect();
      if (status?.state == MqttConnectionState.connected) {
        _isConnected = true;
        _listenToTelemetryTopic(socketId);
        return true;
      }
    } catch (e) {
      print('MQTT connection exception: $e');
      _isConnected = false;
    }
    return false;
  }

  void _listenToTelemetryTopic(String socketId) {
    if (_mqttClient == null) return;
    final topic = MqttTopics.telemetry(socketId);
    _mqttClient!.subscribe(topic, MqttQos.atLeastOnce);

    _mqttClient!.updates?.listen((List<MqttReceivedMessage<MqttMessage>> messages) {
      final recMess = messages[0].payload as MqttPublishMessage;
      final payload =
          MqttPublishPayload.bytesToStringAsString(recMess.payload.message);

      try {
        final data = jsonDecode(payload) as Map<String, dynamic>;
        final metrics = PowerMetrics.fromJson(data);
        _telemetryController.add(metrics);
      } catch (e) {
        print('Error decoding telemetry JSON payload: $e');
      }
    });
  }

  // Send Relay Command (SET ON / OFF)
  Future<void> sendRelayCommand(String socketId, bool turnOn) async {
    if (_isConnected && _mqttClient != null) {
      final builder = MqttClientPayloadBuilder();
      builder.addString(jsonEncode({'relay': turnOn ? 'ON' : 'OFF'}));
      _mqttClient!.publishMessage(
        MqttTopics.relayControl(socketId),
        MqttQos.atLeastOnce,
        builder.payload!,
      );
    }
  }

  // Direct REST API fallback for ESP32 Local Webserver (e.g., http://192.168.1.145/relay?state=1)
  Future<bool> controlRelayViaHttp(String ipAddress, bool turnOn) async {
    try {
      final url = Uri.parse('http://$ipAddress/relay?state=${turnOn ? 1 : 0}');
      final response = await http.get(url).timeout(const Duration(seconds: 3));
      return response.statusCode == 200;
    } catch (e) {
      print('HTTP relay control failed: $e');
      return false;
    }
  }

  // Fetch telemetry once via direct HTTP
  Future<PowerMetrics?> fetchHttpTelemetry(String ipAddress) async {
    try {
      final url = Uri.parse('http://$ipAddress/telemetry');
      final response = await http.get(url).timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return PowerMetrics.fromJson(data);
      }
    } catch (e) {
      print('HTTP telemetry fetch failed: $e');
    }
    return null;
  }

  void disconnect() {
    _mqttClient?.disconnect();
    _isConnected = false;
  }

  void dispose() {
    disconnect();
    _telemetryController.close();
  }
}

