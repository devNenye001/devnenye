import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class SocketControlSwitch extends StatelessWidget {
  final bool isOn;
  final bool isLoading;
  final ValueChanged<bool> onToggle;

  const SocketControlSwitch({
    super.key,
    required this.isOn,
    required this.onToggle,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final activeColor = isOn ? AppColors.safeGreen : AppColors.surfaceLight;
    final glowColor = isOn ? AppColors.safeGreenGlow : Colors.transparent;

    return GestureDetector(
      onTap: isLoading ? null : () => onToggle(!isOn),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        width: 140,
        height: 140,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppColors.surface,
          border: Border.all(
            color: activeColor,
            width: isOn ? 3.5 : 2.0,
          ),
          boxShadow: [
            BoxShadow(
              color: glowColor,
              blurRadius: isOn ? 30 : 0,
              spreadRadius: isOn ? 6 : 0,
            ),
          ],
        ),
        child: Center(
          child: isLoading
              ? const CircularProgressIndicator(color: AppColors.primary)
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.power_settings_new_rounded,
                      size: 54,
                      color: isOn ? AppColors.safeGreen : AppColors.textMuted,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      isOn ? 'POWER ON' : 'POWER OFF',
                      style: TextStyle(
                        color: isOn ? AppColors.safeGreen : AppColors.textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}

