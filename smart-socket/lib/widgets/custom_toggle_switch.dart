import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class CustomToggleSwitch extends StatelessWidget {
  final bool isOn;
  final ValueChanged<bool> onChanged;
  final double width;
  final double height;

  const CustomToggleSwitch({
    super.key,
    required this.isOn,
    required this.onChanged,
    this.width = 46.0,
    this.height = 26.0,
  });

  @override
  Widget build(BuildContext context) {
    final knobSize = height - 6.0;

    return GestureDetector(
      onTap: () => onChanged(!isOn),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeInOut,
        width: width,
        height: height,
        padding: const EdgeInsets.symmetric(horizontal: 3.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(height / 2),
          color: isOn
              ? const Color(0xFF1B2232)
              : const Color(0xFF18191E),
          border: Border.all(
            color: isOn
                ? const Color(0xFF2C4370)
                : const Color(0xFF2A2B33),
            width: 1.0,
          ),
        ),
        child: Align(
          alignment: isOn ? Alignment.centerRight : Alignment.centerLeft,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeInOut,
            width: knobSize,
            height: knobSize,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isOn
                  ? AppColors.switchThumbActive
                  : const Color(0xFF555964),
            ),
          ),
        ),
      ),
    );
  }
}

