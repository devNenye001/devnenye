import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/utils/formatters.dart';
import '../../../widgets/custom_card.dart';

class PowerGaugeCard extends StatelessWidget {
  final double currentWatts;
  final bool isRelayOn;

  const PowerGaugeCard({
    super.key,
    required this.currentWatts,
    required this.isRelayOn,
  });

  @override
  Widget build(BuildContext context) {
    final double percentage = (currentWatts / AppConstants.maxPowerWatts).clamp(0.0, 1.0);
    Color progressColor = AppColors.safeGreen;
    if (percentage > 0.8) {
      progressColor = AppColors.dangerRed;
    } else if (percentage > 0.5) {
      progressColor = AppColors.warningAmber;
    }

    return CustomCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.bolt, color: AppColors.primary, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Active Power Draw (PZEM-004T)',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isRelayOn ? AppColors.surfaceLight : AppColors.card,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  isRelayOn ? 'ACTIVE LOAD' : 'CIRCUIT OPEN',
                  style: TextStyle(
                    color: isRelayOn ? AppColors.safeGreen : AppColors.textMuted,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                isRelayOn ? currentWatts.toStringAsFixed(1) : '0.0',
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 48,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -1.5,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Watts',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: isRelayOn ? percentage : 0.0,
              minHeight: 10,
              backgroundColor: AppColors.surfaceLight,
              valueColor: AlwaysStoppedAnimation<Color>(progressColor),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '0 W',
                style: TextStyle(color: AppColors.textMuted, fontSize: 11),
              ),
              Text(
                '${(percentage * 100).toStringAsFixed(0)}% of Max Rating (${AppConstants.maxPowerWatts.toInt()}W)',
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
              ),
              Text(
                '${AppConstants.maxPowerWatts.toInt()} W',
                style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

