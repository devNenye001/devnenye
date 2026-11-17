class MqttTopics {
  static const String basePrefix = 'aiot/smart_socket';

  static String telemetry(String socketId) => '$basePrefix/$socketId/telemetry';
  static String relayControl(String socketId) => '$basePrefix/$socketId/control/relay';
  static String relayState(String socketId) => '$basePrefix/$socketId/state/relay';
  static String aiAlert(String socketId) => '$basePrefix/$socketId/ai/alerts';
  static String config(String socketId) => '$basePrefix/$socketId/config';
  static String status(String socketId) => '$basePrefix/$socketId/status';
}

