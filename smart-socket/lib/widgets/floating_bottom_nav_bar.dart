import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class FloatingBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const FloatingBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 66,
      margin: const EdgeInsets.symmetric(horizontal: 26, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.navBarBg,
        borderRadius: BorderRadius.circular(35),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildNavItem(
            index: 0,
            activeIcon: Icons.home_rounded,
            inactiveIcon: Icons.home_outlined,
          ),
          _buildNavItem(
            index: 1,
            activeIcon: Icons.grid_view_rounded,
            inactiveIcon: Icons.grid_view_rounded,
          ),
          _buildNavItem(
            index: 2,
            activeIcon: Icons.bar_chart_rounded,
            inactiveIcon: Icons.bar_chart_rounded,
          ),
          _buildNavItem(
            index: 3,
            activeIcon: Icons.settings_rounded,
            inactiveIcon: Icons.settings_outlined,
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData activeIcon,
    required IconData inactiveIcon,
  }) {
    final isSelected = currentIndex == index;

    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeInOut,
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.navActiveBlue : Colors.transparent,
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Icon(
            isSelected ? activeIcon : inactiveIcon,
            color: isSelected ? Colors.white : AppColors.navInactive,
            size: isSelected ? 24 : 22,
          ),
        ),
      ),
    );
  }
}

