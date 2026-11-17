class AppConstants {
  static const String appName = 'AIoT Smart Socket';
  static const String appTagline = 'Intelligent Power-Aware Safety & Monitoring';
  
  // Hardware specifications based on ESP32 & PZEM-004T
  static const double nominalVoltage = 230.0; // Volts (Standard AC mains)
  static const double minAllowedVoltage = 185.0; // Under-voltage trip threshold
  static const double maxAllowedVoltage = 255.0; // Over-voltage trip threshold
  static const double maxContinuousCurrent = 13.0; // Amps (UK/standard socket limit)
  static const double maxTripCurrent = 16.0; // Hard cutoff limit
  static const double maxPowerWatts = 3000.0; // Watts maximum socket rating
  static const double vampireDrainThresholdWatts = 5.0; // Standby energy waste
  static const double nominalFrequency = 50.0; // Hz
  
  // Storage Keys
  static const String keyDeviceId = 'smart_socket_device_id';
  static const String keyMqttBroker = 'smart_socket_mqtt_broker';
  static const String keyMqttPort = 'smart_socket_mqtt_port';
  static const String keyVoiceAlertsEnabled = 'smart_socket_voice_alerts';
  static const String keyAiProtectionEnabled = 'smart_socket_ai_protection';
  static const String keyAutoTripEnabled = 'smart_socket_auto_trip';
  static const String keyCostPerKwh = 'smart_socket_cost_per_kwh';
  
  // Defaults
  static const String defaultBroker = 'broker.hivemq.com';
  static const int defaultPort = 1883;
  static const double defaultElectricityRate = 0.15; // $ / kWh
}

