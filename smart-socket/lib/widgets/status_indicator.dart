import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class StatusIndicator extends StatelessWidget {
  final bool isOnline;
  final bool isRelayOn;
  final String label;

  const StatusIndicator({
    super.key,
    required this.isOnline,
    required this.isRelayOn,
    this.label = 'ESP32 Status',
  });

  @override
  Widget build(BuildContext context) {
    final statusColor = !isOnline
        ? AppColors.textMuted
        : (isRelayOn ? AppColors.safeGreen : AppColors.warningAmber);
    final statusText = !isOnline
        ? 'Offline'
        : (isRelayOn ? 'ACTIVE / ON' : 'STANDBY / OFF');

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: statusColor,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          statusText,
          style: TextStyle(
            color: statusColor,
            fontSize: 12,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
}

