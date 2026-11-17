class EnergyPrediction {
  final double predictedNextHourWatts;
  final double predictedDayKwh;
  final double estimatedDailyCost;
  final double anomalyProbability; // 0.00 to 1.00 (TinyML inference output)
  final bool isAnomalyDetected;
  final String safetyStatus; // 'Safe Normal', 'Watch Closely', 'Hazard Imminent'
  final String aiReasoning;
  final List<String> optimizationTips;
  final DateTime generatedAt;

  const EnergyPrediction({
    required this.predictedNextHourWatts,
    required this.predictedDayKwh,
    required this.estimatedDailyCost,
    required this.anomalyProbability,
    required this.isAnomalyDetected,
    required this.safetyStatus,
    required this.aiReasoning,
    required this.optimizationTips,
    required this.generatedAt,
  });

  factory EnergyPrediction.initial() {
    return EnergyPrediction(
      predictedNextHourWatts: 245.0,
      predictedDayKwh: 3.42,
      estimatedDailyCost: 0.51,
      anomalyProbability: 0.04,
      isAnomalyDetected: false,
      safetyStatus: 'Safe & Stable',
      aiReasoning: 'Load pattern matches learned household profiles. Current power draws are within normal thermal operating bounds.',
      optimizationTips: [
        'Vampire draw is under 2.5W during inactive periods.',
        'No prolonged continuous heavy loads detected.',
        'PZEM-004T reports high power factor (0.98), indicating high efficiency.',
      ],
      generatedAt: DateTime.now(),
    );
  }
}

