import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class SocketWifiScanGraphic extends StatelessWidget {
  final double size;
  final bool isScanning;

  const SocketWifiScanGraphic({
    super.key,
    this.size = 110.0,
    this.isScanning = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: const Color(0xFF161E2C).withOpacity(0.6),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFF24344B),
          width: 1.0,
        ),
      ),
      child: Center(
        child: CustomPaint(
          size: Size(size * 0.65, size * 0.65),
          painter: _SocketWifiPainter(),
        ),
      ),
    );
  }
}

class _SocketWifiPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final strokePaint = Paint()
      ..color = const Color(0xFF4A6894)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.8
      ..strokeCap = StrokeCap.round;

    final fillPaint = Paint()
      ..color = const Color(0xFF4A6894)
      ..style = PaintingStyle.fill;

    final w = size.width;
    final h = size.height;

    // 1. Socket Rectangular Frame (Left side)
    final socketRect = RRect.fromRectAndRadius(
      Rect.fromLTWH(w * 0.08, h * 0.15, w * 0.48, h * 0.7),
      const Radius.circular(8.0),
    );
    canvas.drawRRect(socketRect, strokePaint);

    // Left vertical slot
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
          center: Offset(w * 0.24, h * 0.46),
          width: w * 0.06,
          height: h * 0.22,
        ),
        const Radius.circular(1.0),
      ),
      fillPaint,
    );

    // Right vertical slot
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
          center: Offset(w * 0.40, h * 0.46),
          width: w * 0.06,
          height: h * 0.22,
        ),
        const Radius.circular(1.0),
      ),
      fillPaint,
    );

    // Ground circular hole
    canvas.drawCircle(Offset(w * 0.32, h * 0.68), w * 0.045, fillPaint);

    // 2. Wi-Fi Radiating Waves (Upper right)
    final wifiOrigin = Offset(w * 0.64, h * 0.62);

    // Inner wave
    final innerRect = Rect.fromCircle(center: wifiOrigin, radius: w * 0.16);
    canvas.drawArc(innerRect, -1.8, 1.2, false, strokePaint);

    // Middle wave
    final midRect = Rect.fromCircle(center: wifiOrigin, radius: w * 0.28);
    canvas.drawArc(midRect, -1.8, 1.2, false, strokePaint);

    // Outer wave
    final outerRect = Rect.fromCircle(center: wifiOrigin, radius: w * 0.40);
    canvas.drawArc(outerRect, -1.8, 1.2, false, strokePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

