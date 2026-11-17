import 'package:flutter/material.dart';

class SocketOutletIcon extends StatelessWidget {
  final double size;
  final Color? color;
  final Color? backgroundColor;

  const SocketOutletIcon({
    super.key,
    this.size = 28.0,
    this.color,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? const Color(0xFF9CA3AF);
    final effectiveBg = backgroundColor ?? const Color(0xFF28282E);

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: effectiveBg,
        shape: BoxShape.circle,
        border: Border.all(
          color: const Color(0xFF383A42),
          width: 1.0,
        ),
      ),
      child: Center(
        child: CustomPaint(
          size: Size(size * 0.65, size * 0.65),
          painter: _OutletFacePainter(color: effectiveColor),
        ),
      ),
    );
  }
}

class _OutletFacePainter extends CustomPainter {
  final Color color;

  _OutletFacePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final strokePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.3
      ..strokeCap = StrokeCap.round;

    final fillPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final w = size.width;
    final h = size.height;

    // Outer circle face
    final center = Offset(w / 2, h / 2);
    final radius = w / 2;
    canvas.drawCircle(center, radius, strokePaint);

    // Left vertical slot
    final slotWidth = w * 0.12;
    final slotHeight = h * 0.32;
    final leftSlotRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: Offset(w * 0.35, h * 0.42),
        width: slotWidth,
        height: slotHeight,
      ),
      const Radius.circular(1.0),
    );
    canvas.drawRRect(leftSlotRect, fillPaint);

    // Right vertical slot
    final rightSlotRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: Offset(w * 0.65, h * 0.42),
        width: slotWidth,
        height: slotHeight,
      ),
      const Radius.circular(1.0),
    );
    canvas.drawRRect(rightSlotRect, fillPaint);

    // Ground circular pin hole (bottom center)
    canvas.drawCircle(Offset(w * 0.5, h * 0.72), w * 0.09, fillPaint);
  }

  @override
  bool shouldRepaint(covariant _OutletFacePainter oldDelegate) {
    return oldDelegate.color != color;
  }
}

