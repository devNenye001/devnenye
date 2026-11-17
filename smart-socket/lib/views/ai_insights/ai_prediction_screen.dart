import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/utils/formatters.dart';
import '../../providers/socket_provider.dart';
import '../../providers/ai_analytics_provider.dart';
import '../../widgets/custom_card.dart';

class AiPredictionScreen extends StatelessWidget {
  const AiPredictionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final socketProv = context.watch<SocketProvider>();
    final aiProv = context.watch<AiAnalyticsProvider>();
    final prediction = aiProv.prediction;
    final metrics = socketProv.metrics;

    Color riskColor = AppColors.safeGreen;
    if (prediction.anomalyProbability > 0.6) {
      riskColor = AppColors.dangerRed;
    } else if (prediction.anomalyProbability > 0.3) {
      riskColor = AppColors.warningAmber;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Power Analysis & Predictions'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // TinyML Inference Anomaly Score Card
            CustomCard(
              border: Border.all(color: riskColor.withOpacity(0.5), width: 1.5),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.psychology, color: AppColors.primary, size: 22),
                          SizedBox(width: 8),
                          Text(
                            'TinyML Anomaly Inference',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: riskColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          prediction.safetyStatus.toUpperCase(),
                          style: TextStyle(
                            color: riskColor,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    prediction.aiReasoning,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Calculated Anomaly Probability:',
                        style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                      Text(
                        '${(prediction.anomalyProbability * 100).toStringAsFixed(1)}%',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: riskColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: prediction.anomalyProbability,
                      minHeight: 8,
                      backgroundColor: AppColors.surfaceLight,
                      valueColor: AlwaysStoppedAnimation<Color>(riskColor),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Power Forecasting & Energy Prediction
            CustomCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.timeline, color: AppColors.secondary, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Energy Forecast & Estimations',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildPredictionStat(
                          'Next Hour Draw',
                          '${prediction.predictedNextHourWatts.toStringAsFixed(0)} W',
                          Icons.query_builder,
                          AppColors.primary,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildPredictionStat(
                          'Est. Daily Energy',
                          '${prediction.predictedDayKwh.toStringAsFixed(2)} kWh',
                          Icons.speed,
                          AppColors.energy,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildPredictionStat(
                          'Estimated Cost',
                          Formatters.formatCurrency(prediction.estimatedDailyCost),
                          Icons.monetization_on_outlined,
                          AppColors.safeGreen,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildPredictionStat(
                          'Current Draw',
                          '${metrics.power.toStringAsFixed(1)} W',
                          Icons.bolt,
                          AppColors.voltage,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Waste & Standby Drain Analysis (Vampire power detection)
            CustomCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.energy_savings_leaf, color: AppColors.safeGreen, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Intelligent Waste & Safety Insights',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...prediction.optimizationTips.map((tip) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(
                              Icons.check_circle_rounded,
                              size: 16,
                              color: AppColors.safeGreen,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                tip,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary,
                                  height: 1.3,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )),
                ],
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildPredictionStat(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceLight, width: 0.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: color),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

