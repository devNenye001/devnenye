import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../widgets/floating_bottom_nav_bar.dart';
import 'home_screen.dart';
import 'rooms_screen.dart';
import 'telemetry_screen.dart';
import 'settings_screen.dart';

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Current active screen
          IndexedStack(
            index: _currentIndex,
            children: [
              const HomeScreen(),
              RoomsScreen(
                onNavigateToTab: (index) => setState(() => _currentIndex = index),
              ),
              const TelemetryScreen(),
              const SettingsScreen(),
            ],
          ),

          // Floating Navigation Bar hovering at the bottom
          Positioned(
            left: 0,
            right: 0,
            bottom: MediaQuery.of(context).padding.bottom + 8,
            child: FloatingBottomNavBar(
              currentIndex: _currentIndex,
              onTap: (index) {
                setState(() => _currentIndex = index);
              },
            ),
          ),
        ],
      ),
    );
  }
}
