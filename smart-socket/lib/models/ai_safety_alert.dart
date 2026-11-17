import 'power_metrics.dart';

enum AlertSeverity {
  info,
  warning,
  danger,
  criticalTrip,
}

enum AlertType {
  overcurrent,
  overvoltage,
  undervoltage,
  deviceForgotten,
  vampireDrain,
  overheatingHazard,
  aiSafetyTrip,
  manualRelayToggle,
}

class AiSafetyAlert {
  final String id;
  final AlertType type;
  final AlertSeverity severity;
  final String title;
  final String message;
  final String voiceText; // Text fed into TTS engine for voice alerts
  final DateTime timestamp;
  final bool wasRelayCutoff;
  final PowerMetrics? metricsSnapshot;

  const AiSafetyAlert({
    required this.id,
    required this.type,
    required this.severity,
    required this.title,
    required this.message,
    required this.voiceText,
    required this.timestamp,
    required this.wasRelayCutoff,
    this.metricsSnapshot,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type.name,
      'severity': severity.name,
      'title': title,
      'message': message,
      'voiceText': voiceText,
      'timestamp': timestamp.toIso8601String(),
      'wasRelayCutoff': wasRelayCutoff,
      'metricsSnapshot': metricsSnapshot?.toJson(),
    };
  }

  factory AiSafetyAlert.fromJson(Map<String, dynamic> json) {
    return AiSafetyAlert(
      id: json['id'] as String,
      type: AlertType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => AlertType.aiSafetyTrip,
      ),
      severity: AlertSeverity.values.firstWhere(
        (e) => e.name == json['severity'],
        orElse: () => AlertSeverity.warning,
      ),
      title: json['title'] as String,
      message: json['message'] as String,
      voiceText: json['voiceText'] as String? ?? json['message'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      wasRelayCutoff: json['wasRelayCutoff'] as bool? ?? false,
      metricsSnapshot: json['metricsSnapshot'] != null
          ? PowerMetrics.fromJson(json['metricsSnapshot'] as Map<String, dynamic>)
          : null,
    );
  }
}

