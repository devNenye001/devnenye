import 'dart:async';
import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../widgets/socket_wifi_scan_graphic.dart';
import 'configure_new_socket_screen.dart';

class AddSocketScanScreen extends StatefulWidget {
  const AddSocketScanScreen({super.key});

  @override
  State<AddSocketScanScreen> createState() => _AddSocketScanScreenState();
}

class _AddSocketScanScreenState extends State<AddSocketScanScreen> {
  bool _isSearching = true;
  String? _selectedSocketId;
  Timer? _searchTimer;

  final List<String> _discoveredSockets = const [
    'Socket MXH-76809',
    'Socket MXH-45236',
  ];

  @override
  void initState() {
    super.initState();
    // Simulate Bluetooth / Wi-Fi discovery after 1.8s
    _searchTimer = Timer(const Duration(milliseconds: 1800), () {
      if (mounted) {
        setState(() {
          _isSearching = false;
          _selectedSocketId = _discoveredSockets.first; // Pre-select as in iPhone 16 - 12
        });
      }
    });
  }

  @override
  void dispose() {
    _searchTimer?.cancel();
    super.dispose();
  }

  void _onConnect() {
    if (_selectedSocketId == null) return;
    Navigator.of(context).push(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 400),
        pageBuilder: (_, __, ___) => ConfigureNewSocketScreen(
          defaultSocketName: _selectedSocketId!,
        ),
        transitionsBuilder: (_, animation, __, child) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(1, 0),
              end: Offset.zero,
            ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic)),
            child: child,
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 1. Blue Top Header
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 155,
            child: Container(
              color: AppColors.headerBlue,
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
                        onPressed: () => Navigator.pop(context),
                      ),
                      const Text(
                        'Add Socket',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.2,
                        ),
                      ),
                      const SizedBox(width: 48), // Balance leading back button
                    ],
                  ),
                ),
              ),
            ),
          ),

          // 2. Dark Body Sheet with rounded top corners
          Positioned.fill(
            top: 110,
            child: Container(
              decoration: const BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 24),

                    // Top Socket Wi-Fi Scan Graphic
                    const Center(
                      child: SocketWifiScanGraphic(size: 110),
                    ),

                    const SizedBox(height: 36),

                    if (_isSearching) ...[
                      // --- Scanning State (iPhone 16 - 10) ---
                      const Center(
                        child: Text(
                          'Searching for a new socket.....',
                          style: TextStyle(
                            color: Color(0xFF8E95A5),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Center(
                        child: SizedBox(
                          width: 26,
                          height: 26,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white70),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Center(
                        child: TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text(
                            'Cancel',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ] else ...[
                      // --- Discovered List State (iPhone 16 - 11 & iPhone 16 - 12) ---
                      const Text(
                        'Select socket',
                        style: TextStyle(
                          color: Color(0xFF8E95A5),
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 10),

                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFF182334),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: const Color(0xFF263750),
                            width: 1.0,
                          ),
                        ),
                        child: Column(
                          children: [
                            for (int i = 0; i < _discoveredSockets.length; i++) ...[
                              _buildSocketOptionTile(_discoveredSockets[i]),
                              if (i < _discoveredSockets.length - 1)
                                const Divider(
                                  color: Color(0xFF263750),
                                  height: 1,
                                  indent: 16,
                                  endIndent: 16,
                                ),
                            ],
                          ],
                        ),
                      ),

                      const Spacer(),

                      // Connect Button
                      GestureDetector(
                        onTap: _selectedSocketId != null ? _onConnect : null,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          height: 52,
                          decoration: BoxDecoration(
                            color: _selectedSocketId != null
                                ? AppColors.primary
                                : const Color(0xFF172335),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Center(
                            child: Text(
                              'Connect',
                              style: TextStyle(
                                color: _selectedSocketId != null
                                    ? Colors.white
                                    : const Color(0xFF5A6E8C),
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                letterSpacing: -0.2,
                              ),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),
                    ],

                    // Home indicator
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
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSocketOptionTile(String name) {
    final isSelected = _selectedSocketId == name;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedSocketId = name;
        });
      },
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              name,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14.5,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.2,
              ),
            ),
            if (isSelected)
              const Icon(
                Icons.check_rounded,
                color: Colors.white,
                size: 20,
              ),
          ],
        ),
      ),
    );
  }
}

