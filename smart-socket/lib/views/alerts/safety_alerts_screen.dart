import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/utils/formatters.dart';
import '../../models/ai_safety_alert.dart';
import '../../providers/alert_provider.dart';
import '../../widgets/custom_card.dart';

class SafetyAlertsScreen extends StatelessWidget {
  const SafetyAlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final alertProv = context.watch<AlertProvider>();
    final alerts = alertProv.alerts;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Safety & Hazard Log'),
        actions: [
          if (alerts.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_outlined),
              tooltip: 'Clear Log',
              onPressed: () => alertProv.clearAlerts(),
            ),
        ],
      ),
      body: alerts.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shield_outlined, size: 64, color: AppColors.safeGreen),
                  SizedBox(height: 16),
                  Text(
                    'No Abnormalities Detected',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'AI protection engine is continuously monitoring electrical safety.',
                    style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: alerts.length,
              separatorBuilder: (ctx, i) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final alert = alerts[index];
                return _buildAlertCard(context, alert, alertProv);
              },
            ),
    );
  }

  Widget _buildAlertCard(
      BuildContext context, AiSafetyAlert alert, AlertProvider alertProv) {
    Color severityColor = AppColors.primary;
    IconData icon = Icons.info_outline;

    switch (alert.severity) {
      case AlertSeverity.info:
        severityColor = AppColors.primary;
        icon = Icons.info_outline;
        break;
      case AlertSeverity.warning:
        severityColor = AppColors.warningAmber;
        icon = Icons.warning_amber_rounded;
        break;
      case AlertSeverity.danger:
        severityColor = AppColors.dangerRed;
        icon = Icons.error_outline;
        break;
      case AlertSeverity.criticalTrip:
        severityColor = AppColors.dangerRed;
        icon = Icons.offline_bolt_rounded;
        break;
    }

    return CustomCard(
      border: Border.all(color: severityColor.withOpacity(0.4), width: 1),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: severityColor.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: severityColor, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      alert.title,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      Formatters.formatDateTime(alert.timestamp),
                      style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              if (alert.wasRelayCutoff)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.dangerRed,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'AUTO CUTOFF',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            alert.message,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.3,
            ),
          ),
          if (alert.metricsSnapshot != null) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildSnapshotStat('V', '${alert.metricsSnapshot!.voltage.toStringAsFixed(0)}V'),
                  _buildSnapshotStat('I', '${alert.metricsSnapshot!.current.toStringAsFixed(1)}A'),
                  _buildSnapshotStat('P', '${alert.metricsSnapshot!.power.toStringAsFixed(0)}W'),
                  _buildSnapshotStat('PF', alert.metricsSnapshot!.powerFactor.toStringAsFixed(2)),
                ],
              ),
            ),
          ],
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () => alertProv.replayVoiceAlert(alert),
                icon: const Icon(Icons.volume_up, size: 16),
                label: const Text('Replay Voice Alert', style: TextStyle(fontSize: 11)),
                style: TextButton.styleFrom(
                  foregroundColor: AppColors.primary,
                  visualDensity: VisualDensity.compact,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSnapshotStat(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
      ],
    );
  }
}

