import 'package:flutter_test/flutter_test.dart';
import 'package:smart_socket/models/power_metrics.dart';
import 'package:smart_socket/models/ai_safety_alert.dart';
import 'package:smart_socket/services/tinyml_ai_engine.dart';

void main() {
  group('AIoT Smart Socket AI Engine Tests', () {
    test('TinyML engine triggers emergency trip on overcurrent exceeding threshold', () {
      final engine = TinyMlAiEngine();
      final overloadMetrics = PowerMetrics(
        voltage: 230.0,
        current: 16.5, // Exceeds 13.0A limit
        power: 3795.0,
        energy: 1.25,
        frequency: 50.0,
        powerFactor: 0.99,
        timestamp: DateTime.now(),
      );

      final alert = engine.evaluateSafety(
        overloadMetrics,
        isRelayOn: true,
        aiProtectionEnabled: true,
        maxCurrentLimit: 13.0,
      );

      expect(alert, isNotNull);
      expect(alert!.severity, equals(AlertSeverity.criticalTrip));
      expect(alert.wasRelayCutoff, isTrue);
      expect(alert.type, equals(AlertType.overcurrent));
    });

    test('TinyML engine triggers overvoltage alert on grid surge', () {
      final engine = TinyMlAiEngine();
      final surgeMetrics = PowerMetrics(
        voltage: 260.0, // Exceeds 255V
        current: 2.0,
        power: 520.0,
        energy: 1.25,
        frequency: 50.0,
        powerFactor: 1.0,
        timestamp: DateTime.now(),
      );

      final alert = engine.evaluateSafety(
        surgeMetrics,
        isRelayOn: true,
        aiProtectionEnabled: true,
        maxCurrentLimit: 13.0,
      );

      expect(alert, isNotNull);
      expect(alert!.type, equals(AlertType.overvoltage));
      expect(alert.wasRelayCutoff, isTrue);
    });

    test('TinyML engine generates valid energy prediction and anomaly score', () {
      final engine = TinyMlAiEngine();
      final normalMetrics = PowerMetrics(
        voltage: 230.0,
        current: 0.8,
        power: 180.0,
        energy: 0.45,
        frequency: 50.0,
        powerFactor: 0.98,
        timestamp: DateTime.now(),
      );

      final prediction = engine.generatePrediction(normalMetrics, 0.15);

      expect(prediction.anomalyProbability, lessThan(0.5));
      expect(prediction.isAnomalyDetected, isFalse);
      expect(prediction.predictedDayKwh, greaterThan(0));
    });
  });
}

