import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class AiStatusBadge extends StatelessWidget {
  final bool isAiActive;
  final String status;
  final double anomalyScore;

  const AiStatusBadge({
    super.key,
    required this.isAiActive,
    required this.status,
    required this.anomalyScore,
  });

  @override
  Widget build(BuildContext context) {
    Color badgeColor = AppColors.safeGreen;
    if (anomalyScore > 0.6) {
      badgeColor = AppColors.dangerRed;
    } else if (anomalyScore > 0.3) {
      badgeColor = AppColors.warningAmber;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: badgeColor.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: badgeColor.withOpacity(0.4), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isAiActive ? Icons.psychology : Icons.psychology_outlined,
            size: 16,
            color: badgeColor,
          ),
          const SizedBox(width: 6),
          Text(
            isAiActive ? 'TinyML: $status' : 'AI Protection Disabled',
            style: TextStyle(
              color: badgeColor,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

