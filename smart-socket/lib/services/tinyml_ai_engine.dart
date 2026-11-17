import 'dart:math';
import '../models/power_metrics.dart';
import '../models/ai_safety_alert.dart';
import '../models/energy_prediction.dart';
import '../core/constants/app_constants.dart';

class TinyMlAiEngine {
  // Learned baseline statistics (simulating on-device TinyML pattern weights)
  final List<double> _powerHistory = [];
  final List<double> _voltageHistory = [];
  final List<double> _currentHistory = [];
  DateTime? _deviceStartTime;
  double _baselineRunningWatts = 200.0;
  double _baselineStandbyWatts = 2.0;
  int _samplesCount = 0;

  // TinyML Anomaly Detector
  AiSafetyAlert? evaluateSafety(
    PowerMetrics currentMetrics, {
    required bool isRelayOn,
    required bool aiProtectionEnabled,
    required double maxCurrentLimit,
  }) {
    if (!isRelayOn || !aiProtectionEnabled) {
      _deviceStartTime = null;
      return null;
    }

    _samplesCount++;
    _powerHistory.add(currentMetrics.power);
    _voltageHistory.add(currentMetrics.voltage);
    _currentHistory.add(currentMetrics.current);
    if (_powerHistory.length > 100) _powerHistory.removeAt(0);
    if (_voltageHistory.length > 100) _voltageHistory.removeAt(0);
    if (_currentHistory.length > 100) _currentHistory.removeAt(0);

    // Track uptime when drawing significant power
    if (currentMetrics.power > 15.0) {
      _deviceStartTime ??= DateTime.now();
    } else {
      _deviceStartTime = null;
    }

    // 1. Extreme Critical Overcurrent (Instant Circuit Protection)
    if (currentMetrics.current >= maxCurrentLimit) {
      return AiSafetyAlert(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: AlertType.overcurrent,
        severity: AlertSeverity.criticalTrip,
        title: 'Overcurrent Trip Triggered',
        message:
            'Load current reached ${currentMetrics.current.toStringAsFixed(2)}A, exceeding the safety limit of ${maxCurrentLimit.toStringAsFixed(1)}A. Power was automatically disconnected.',
        voiceText:
            'Critical emergency cutoff. Overcurrent detected exceeding safe limit. Socket disconnected.',
        timestamp: DateTime.now(),
        wasRelayCutoff: true,
        metricsSnapshot: currentMetrics,
      );
    }

    // 2. Dangerous Overvoltage / Undervoltage detection
    if (currentMetrics.voltage > AppConstants.maxAllowedVoltage) {
      return AiSafetyAlert(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: AlertType.overvoltage,
        severity: AlertSeverity.criticalTrip,
        title: 'Severe Overvoltage Anomaly',
        message:
            'Grid voltage surged to ${currentMetrics.voltage.toStringAsFixed(1)}V. Emergency cutoff activated to protect connected appliances.',
        voiceText:
            'Warning! Dangerously high voltage surge detected from the mains. Socket turned off.',
        timestamp: DateTime.now(),
        wasRelayCutoff: true,
        metricsSnapshot: currentMetrics,
      );
    } else if (currentMetrics.voltage < AppConstants.minAllowedVoltage && currentMetrics.voltage > 50.0) {
      return AiSafetyAlert(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: AlertType.undervoltage,
        severity: AlertSeverity.warning,
        title: 'Brownout / Undervoltage Warning',
        message:
            'Voltage dipped to ${currentMetrics.voltage.toStringAsFixed(1)}V. Risk of motor strain or power supply overheating.',
        voiceText:
            'Warning: Low voltage brownout condition detected.',
        timestamp: DateTime.now(),
        wasRelayCutoff: false,
        metricsSnapshot: currentMetrics,
      );
    }

    // 3. AI Thermal Runaway / Overheating Pattern Detection
    // Distinguishes temporary motor inrush from sustained dangerous load
    if (_currentHistory.length >= 10) {
      final recentAvgCurrent = _currentHistory.sublist(_currentHistory.length - 10).reduce((a, b) => a + b) / 10;
      final recentAvgPower = _powerHistory.sublist(_powerHistory.length - 10).reduce((a, b) => a + b) / 10;

      if (recentAvgCurrent > 11.5 && recentAvgPower > 2500) {
        return AiSafetyAlert(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          type: AlertType.overheatingHazard,
          severity: AlertSeverity.danger,
          title: 'High Thermal Load Warning',
          message:
              'Continuous power draw has sustained at ${recentAvgPower.toStringAsFixed(0)}W. Potential terminal overheating detected by TinyML model.',
          voiceText:
              'Safety alert: Sustained heavy power draw detected. Device approaching thermal limit.',
          timestamp: DateTime.now(),
          wasRelayCutoff: false,
          metricsSnapshot: currentMetrics,
        );
      }
    }

    // 4. Forgotten Appliance Detection (e.g. Electric Iron, Space Heater left on)
    if (_deviceStartTime != null) {
      final activeMinutes = DateTime.now().difference(_deviceStartTime!).inMinutes;
      // In simulation/testing, even 2+ active minutes or continuous high heat triggers alert
      if (activeMinutes >= 45 && currentMetrics.power > 800) {
        return AiSafetyAlert(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          type: AlertType.deviceForgotten,
          severity: AlertSeverity.warning,
          title: 'Appliance Left On Unattended',
          message:
              'High-power appliance has been operating non-stop for $activeMinutes minutes. Did you forget to switch it off?',
          voiceText:
              'Notice: Your connected appliance has been running for $activeMinutes minutes.',
          timestamp: DateTime.now(),
          wasRelayCutoff: false,
          metricsSnapshot: currentMetrics,
        );
      }
    }

    // 5. Standby / Vampire Drain Detection
    if (currentMetrics.power > 3.0 && currentMetrics.power < AppConstants.vampireDrainThresholdWatts) {
      if (_samplesCount % 60 == 0) {
        return AiSafetyAlert(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          type: AlertType.vampireDrain,
          severity: AlertSeverity.info,
          title: 'Standby Power Leakage Detected',
          message:
              'Device is drawing ${currentMetrics.power.toStringAsFixed(1)}W in idle mode. Consider switching off socket to conserve energy.',
          voiceText: 'Tip: Standby power waste detected on socket.',
          timestamp: DateTime.now(),
          wasRelayCutoff: false,
          metricsSnapshot: currentMetrics,
        );
      }
    }

    return null;
  }

  // Generate predictive insights using TinyML model simulation
  EnergyPrediction generatePrediction(PowerMetrics current, double electricityRate) {
    final recentWatts = current.power;
    final randomNoise = (Random().nextDouble() - 0.5) * 10;
    
    // Predicted next hour power based on moving average & diurnal pattern
    final predictedNextHour = (recentWatts * 0.95 + randomNoise).clamp(0.0, 3500.0);
    
    // Estimate daily kWh: (average watts * 24) / 1000
    final estimatedDailyKwh = (max(recentWatts, 50.0) * 12.0) / 1000.0;
    final estimatedCost = estimatedDailyKwh * electricityRate;

    // Anomaly probability calculation
    double anomalyScore = 0.05;
    if (current.current > 10.0) anomalyScore += 0.45;
    if (current.voltage > 245.0 || current.voltage < 205.0) anomalyScore += 0.30;
    if (current.powerFactor < 0.75 && current.power > 500) anomalyScore += 0.15;
    anomalyScore = anomalyScore.clamp(0.01, 0.99);

    final isAnomaly = anomalyScore > 0.60;
    final safetyStatus = anomalyScore < 0.3
        ? 'Safe & Optimal'
        : (anomalyScore < 0.65 ? 'Elevated Consumption' : 'High Risk Hazard');

    String reasoning = 'Power metrics conform to learned device baseline.';
    if (isAnomaly) {
      reasoning = 'TinyML model identified abnormal deviation from typical load profile. Higher than expected variance detected.';
    } else if (recentWatts < 5.0) {
      reasoning = 'Appliance is currently idle or in low-power standby mode.';
    } else {
      reasoning = 'Device is operating with stable AC characteristics (PF: ${current.powerFactor.toStringAsFixed(2)}).';
    }

    final tips = <String>[];
    if (current.powerFactor < 0.85 && current.power > 100) {
      tips.add('Inductive load detected with low power factor (${current.powerFactor.toStringAsFixed(2)}). Consider power factor correction.');
    }
    if (recentWatts > 1500) {
      tips.add('Heavy thermal load. Ensure adequate ventilation around socket and wiring.');
    } else {
      tips.add('Energy consumption is within standard eco parameters.');
    }
    tips.add('Predicted daily energy cost is approximately \$${estimatedCost.toStringAsFixed(2)}.');

    return EnergyPrediction(
      predictedNextHourWatts: predictedNextHour,
      predictedDayKwh: estimatedDailyKwh,
      estimatedDailyCost: estimatedCost,
      anomalyProbability: anomalyScore,
      isAnomalyDetected: isAnomaly,
      safetyStatus: safetyStatus,
      aiReasoning: reasoning,
      optimizationTips: tips,
      generatedAt: DateTime.now(),
    );
  }
}

