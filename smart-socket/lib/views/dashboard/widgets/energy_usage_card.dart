import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class EnergyUsageCard extends StatelessWidget {
  final int activeSockets;
  final double todayUsageKw;

  const EnergyUsageCard({
    super.key,
    required this.activeSockets,
    required this.todayUsageKw,
  });

  @override
  Widget build(BuildContext context) {
    // Format "76,2" with comma as in the design
    final usageText = todayUsageKw.toStringAsFixed(1).replaceAll('.', ',');

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: const Color(0xFF2A2B33),
          width: 0.8,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.35),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Energy Usage',
            style: TextStyle(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.w600,
              letterSpacing: -0.2,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              // Left Column: Active sockets
              Expanded(
                child: Column(
                  children: [
                    const Text(
                      'Active sockets',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '$activeSockets',
                      style: const TextStyle(
                        color: AppColors.activeGreen,
                        fontSize: 27,
                        fontWeight: FontWeight.bold,
                        height: 1.1,
                      ),
                    ),
                  ],
                ),
              ),

              // Vertical Divider
              Container(
                width: 1,
                height: 44,
                color: AppColors.divider,
              ),

              // Right Column: Today usage
              Expanded(
                child: Column(
                  children: [
                    const Text(
                      'Today',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          usageText,
                          style: const TextStyle(
                            color: AppColors.energyBlue,
                            fontSize: 27,
                            fontWeight: FontWeight.bold,
                            height: 1.1,
                          ),
                        ),
                        const SizedBox(width: 2),
                        const Text(
                          'Kw',
                          style: TextStyle(
                            color: AppColors.energyBlue,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

