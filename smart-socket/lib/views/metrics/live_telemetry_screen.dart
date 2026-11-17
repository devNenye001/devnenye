import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/socket_provider.dart';
import '../../widgets/custom_card.dart';

enum ChartMetricType { power, voltage, current }

class LiveTelemetryScreen extends StatefulWidget {
  const LiveTelemetryScreen({super.key});

  @override
  State<LiveTelemetryScreen> createState() => _LiveTelemetryScreenState();
}

class _LiveTelemetryScreenState extends State<LiveTelemetryScreen> {
  ChartMetricType _selectedMetric = ChartMetricType.power;

  @override
  Widget build(BuildContext context) {
    final socketProv = context.watch<SocketProvider>();
    final history = socketProv.history;
    final currentMetrics = socketProv.metrics;

    List<FlSpot> spots = [];
    double minY = 0;
    double maxY = 100;
    Color chartColor = AppColors.power;
    String unit = 'W';

    if (history.isNotEmpty) {
      switch (_selectedMetric) {
        case ChartMetricType.power:
          spots = history.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value.power)).toList();
          maxY = (history.map((m) => m.power).reduce((a, b) => a > b ? a : b) * 1.25).clamp(100.0, 3500.0);
          minY = 0;
          chartColor = AppColors.power;
          unit = 'W';
          break;
        case ChartMetricType.voltage:
          spots = history.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value.voltage)).toList();
          maxY = 260.0;
          minY = 180.0;
          chartColor = AppColors.voltage;
          unit = 'V';
          break;
        case ChartMetricType.current:
          spots = history.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value.current)).toList();
          maxY = (history.map((m) => m.current).reduce((a, b) => a > b ? a : b) * 1.3).clamp(5.0, 16.0);
          minY = 0;
          chartColor = AppColors.current;
          unit = 'A';
          break;
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Telemetry (PZEM-004T)'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Metric selector pills
            Row(
              children: [
                _buildFilterButton('Active Power', ChartMetricType.power, AppColors.power),
                const SizedBox(width: 8),
                _buildFilterButton('Voltage', ChartMetricType.voltage, AppColors.voltage),
                const SizedBox(width: 8),
                _buildFilterButton('Current', ChartMetricType.current, AppColors.current),
              ],
            ),

            const SizedBox(height: 16),

            // Live Real-Time Waveform Chart
            CustomCard(
              padding: const EdgeInsets.fromLTRB(12, 20, 16, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Continuous Sensor Stream ($unit)',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: chartColor.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '1.0s SAMPLING',
                          style: TextStyle(
                            color: chartColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    height: 220,
                    child: spots.isEmpty
                        ? const Center(
                            child: Text(
                              'Waiting for telemetry packets...',
                              style: TextStyle(color: AppColors.textMuted),
                            ),
                          )
                        : LineChart(
                            LineChartData(
                              gridData: FlGridData(
                                show: true,
                                drawVerticalLine: false,
                                horizontalInterval: (maxY - minY) / 4,
                                getDrawingHorizontalLine: (value) => FlLine(
                                  color: AppColors.surfaceLight.withOpacity(0.4),
                                  strokeWidth: 1,
                                ),
                              ),
                              titlesData: FlTitlesData(
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                bottomTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                leftTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    reservedSize: 42,
                                    getTitlesWidget: (val, meta) => Text(
                                      val.toInt().toString(),
                                      style: const TextStyle(
                                        color: AppColors.textMuted,
                                        fontSize: 10,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              borderData: FlBorderData(show: false),
                              minX: 0,
                              maxX: 29,
                              minY: minY,
                              maxY: maxY,
                              lineBarsData: [
                                LineChartBarData(
                                  spots: spots,
                                  isCurved: true,
                                  color: chartColor,
                                  barWidth: 2.8,
                                  isStrokeCapRound: true,
                                  dotData: const FlDotData(show: false),
                                  belowBarData: BarAreaData(
                                    show: true,
                                    color: chartColor.withOpacity(0.15),
                                  ),
                                ),
                              ],
                            ),
                          ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // PZEM-004T Hardware Register Summary
            CustomCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'PZEM-004T Register Raw Telemetry',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildRegisterRow('Voltage Register (0x0000)', '${currentMetrics.voltage.toStringAsFixed(1)} V'),
                  const Divider(color: AppColors.surfaceLight, height: 16),
                  _buildRegisterRow('Current Register (0x0001)', '${currentMetrics.current.toStringAsFixed(3)} A'),
                  const Divider(color: AppColors.surfaceLight, height: 16),
                  _buildRegisterRow('Power Register (0x0003)', '${currentMetrics.power.toStringAsFixed(1)} W'),
                  const Divider(color: AppColors.surfaceLight, height: 16),
                  _buildRegisterRow('Energy Register (0x0005)', '${currentMetrics.energy.toStringAsFixed(4)} kWh'),
                  const Divider(color: AppColors.surfaceLight, height: 16),
                  _buildRegisterRow('Frequency Register (0x0007)', '${currentMetrics.frequency.toStringAsFixed(1)} Hz'),
                  const Divider(color: AppColors.surfaceLight, height: 16),
                  _buildRegisterRow('Power Factor Register (0x0008)', currentMetrics.powerFactor.toStringAsFixed(2)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterButton(String label, ChartMetricType type, Color color) {
    final isSelected = _selectedMetric == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedMetric = type),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? color.withOpacity(0.2) : AppColors.surface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? color : AppColors.surfaceLight,
              width: 1,
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? color : AppColors.textSecondary,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRegisterRow(String register, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(register, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
      ],
    );
  }
}

