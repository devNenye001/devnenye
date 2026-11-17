import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/socket_provider.dart';
import '../../providers/alert_provider.dart';
import '../../providers/ai_analytics_provider.dart';
import '../../widgets/custom_card.dart';
import '../auth/login_screen.dart';

class DeviceSettingsScreen extends StatefulWidget {
  const DeviceSettingsScreen({super.key});

  @override
  State<DeviceSettingsScreen> createState() => _DeviceSettingsScreenState();
}

class _DeviceSettingsScreenState extends State<DeviceSettingsScreen> {
  final _ipController = TextEditingController();
  final _rateController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final socket = context.read<SocketProvider>();
    final ai = context.read<AiAnalyticsProvider>();
    _ipController.text = socket.device.ipAddress;
    _rateController.text = ai.electricityRate.toStringAsFixed(2);
  }

  @override
  void dispose() {
    _ipController.dispose();
    _rateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final socketProv = context.watch<SocketProvider>();
    final alertProv = context.watch<AlertProvider>();
    final aiProv = context.watch<AiAnalyticsProvider>();
    final device = socketProv.device;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Socket & AI Configuration'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Mode Selector: Simulator vs Real ESP32
            CustomCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Connectivity & Hardware Mode',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Hardware Simulator Mode', style: TextStyle(fontSize: 14)),
                    subtitle: const Text(
                      'Run self-contained simulation without needing physical ESP32 breadboard',
                      style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                    value: socketProv.isUsingSimulator,
                    onChanged: (val) => socketProv.setUseSimulator(val),
                  ),
                  if (!socketProv.isUsingSimulator) ...[
                    const Divider(color: AppColors.surfaceLight),
                    TextField(
                      controller: _ipController,
                      decoration: const InputDecoration(
                        labelText: 'ESP32 Device IP Address',
                        hintText: '192.168.1.145',
                        isDense: true,
                      ),
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 16),

            // AI Safety & Protection Controls
            CustomCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'AI-Driven Safety & Prediction Engine',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('TinyML Anomaly Protection', style: TextStyle(fontSize: 14)),
                    subtitle: const Text(
                      'Continuously monitor power curves and flag abnormal spikes or runaway loads',
                      style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                    value: device.aiProtectionEnabled,
                    onChanged: (val) => socketProv.setAiProtection(val),
                  ),
                  const Divider(color: AppColors.surfaceLight),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Auto-Disconnect Relay on Hazard', style: TextStyle(fontSize: 14)),
                    subtitle: const Text(
                      'De-energize 5V relay automatically when critical faults or overheating are detected',
                      style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                    value: device.autoTripEnabled,
                    onChanged: (val) => socketProv.setAutoTrip(val),
                  ),
                  const Divider(color: AppColors.surfaceLight),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Spoken Voice Alerts (TTS)', style: TextStyle(fontSize: 14)),
                    subtitle: const Text(
                      'Announce emergency shutdowns and forgotten appliance warnings aloud',
                      style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                    value: alertProv.voiceEnabled,
                    onChanged: (val) => alertProv.setVoiceEnabled(val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Electrical Trip Thresholds
            CustomCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Hard Overcurrent Cutoff Limit',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '${device.maxCurrentLimit.toStringAsFixed(1)} A',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Safety limit for the 5V relay and connected appliance circuit',
                    style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                  Slider(
                    value: device.maxCurrentLimit,
                    min: 2.0,
                    max: 16.0,
                    divisions: 14,
                    activeColor: AppColors.primary,
                    onChanged: (val) => socketProv.setMaxCurrentLimit(val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Hardware Schematic Architecture Reference
            CustomCard(
              backgroundColor: AppColors.card,
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.memory, color: AppColors.primary, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Hardware Stack Documentation',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 10),
                  Text(
                    '• Microcontroller: ESP32 Dual-Core Wi-Fi / BLE\n'
                    '• Sensor Module: PZEM-004T v3.0 (V, I, P, E, Hz, PF)\n'
                    '• Actuator: 5V Relay Module (Optocoupler-isolated)\n'
                    '• AC-DC Power: Hi-Link HLK-PM01 (230V AC to 5V DC)\n'
                    '• Protection: Fast-acting Fuse & Metal Oxide Varistor (MOV)\n'
                    '• UI Feedback: Status LED & Manual Push Button',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.5),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // VoltPass Account & Sign Out
            CustomCard(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(Icons.bolt_rounded, color: Color(0xFFF97316), size: 22),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'Emma',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          Text(
                            'Emma@gmail.com',
                            style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                          ),
                        ],
                      ),
                    ],
                  ),
                  TextButton.icon(
                    style: TextButton.styleFrom(foregroundColor: AppColors.dangerRed),
                    icon: const Icon(Icons.logout_rounded, size: 16),
                    label: const Text('Sign Out'),
                    onPressed: () {
                      Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                        (route) => false,
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 36),
          ],
        ),
      ),
    );
  }
}

