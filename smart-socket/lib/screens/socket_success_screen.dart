import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import 'main_navigation_shell.dart';

class SocketSuccessScreen extends StatelessWidget {
  final String socketName;

  const SocketSuccessScreen({
    super.key,
    this.socketName = 'Smart Socket',
  });

  void _onProceed(BuildContext context) {
    Navigator.of(context).pushAndRemoveUntil(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 500),
        pageBuilder: (_, __, ___) => const MainNavigationShell(),
        transitionsBuilder: (_, animation, __, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121214),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Status Bar Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '9:41',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Row(
                    children: const [
                      Icon(Icons.signal_cellular_alt, size: 14, color: Colors.white),
                      SizedBox(width: 4),
                      Icon(Icons.wifi, size: 14, color: Colors.white),
                      SizedBox(width: 4),
                      Icon(Icons.battery_full, size: 16, color: Colors.white),
                    ],
                  ),
                ],
              ),

              const Spacer(flex: 3),

              // Concentric Green Badge (Flat / Clean, No Glow)
              Center(
                child: Container(
                  width: 130,
                  height: 130,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFF1E5836),
                  ),
                  child: Center(
                    child: Container(
                      width: 90,
                      height: 90,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFF22C55E),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.check_rounded,
                          color: Colors.white,
                          size: 52,
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 36),

              // Congratulations Message
              const Center(
                child: Text(
                  'Congratulations!! you have\nsuccessfully added a new\nsocket.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Color(0xFFE2E8F0),
                    fontSize: 15.5,
                    fontWeight: FontWeight.w500,
                    height: 1.45,
                    letterSpacing: -0.2,
                  ),
                ),
              ),

              const Spacer(flex: 4),

              // Proceed Button
              GestureDetector(
                onTap: () => _onProceed(context),
                child: Container(
                  height: 52,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Center(
                    child: Text(
                      'Proceed',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.2,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Home Indicator
              Center(
                child: Container(
                  width: 135,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.35),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 6),
            ],
          ),
        ),
      ),
    );
  }
}

