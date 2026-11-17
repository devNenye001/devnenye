import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class SlideToGetStarted extends StatefulWidget {
  final VoidCallback onSlideComplete;
  final String text;

  const SlideToGetStarted({
    super.key,
    required this.onSlideComplete,
    this.text = 'Slide to get started',
  });

  @override
  State<SlideToGetStarted> createState() => _SlideToGetStartedState();
}

class _SlideToGetStartedState extends State<SlideToGetStarted>
    with SingleTickerProviderStateMixin {
  double _dragPosition = 0.0;
  late AnimationController _resetController;
  late Animation<double> _resetAnimation;

  @override
  void initState() {
    super.initState();
    _resetController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _resetController.addListener(() {
      setState(() {
        _dragPosition = _resetAnimation.value;
      });
    });
  }

  @override
  void dispose() {
    _resetController.dispose();
    super.dispose();
  }

  void _onDragUpdate(DragUpdateDetails details, double maxDrag) {
    if (_resetController.isAnimating) return;
    setState(() {
      _dragPosition = (_dragPosition + details.primaryDelta!).clamp(0.0, maxDrag);
    });
  }

  void _onDragEnd(DragEndDetails details, double maxDrag) {
    if (_dragPosition >= maxDrag * 0.72) {
      // Complete slide
      setState(() {
        _dragPosition = maxDrag;
      });
      Future.delayed(const Duration(milliseconds: 150), () {
        widget.onSlideComplete();
      });
    } else {
      // Spring back
      _resetAnimation = Tween<double>(begin: _dragPosition, end: 0.0).animate(
        CurvedAnimation(parent: _resetController, curve: Curves.easeOutBack),
      );
      _resetController.forward(from: 0.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    const trackHeight = 62.0;
    const thumbSize = 50.0;
    const padding = 6.0;

    return LayoutBuilder(
      builder: (context, constraints) {
        final maxDrag = constraints.maxWidth - thumbSize - (padding * 2);
        final progress = maxDrag > 0 ? (_dragPosition / maxDrag).clamp(0.0, 1.0) : 0.0;

        return Container(
          height: trackHeight,
          decoration: BoxDecoration(
            color: const Color(0x6629528A), // Translucent blue glass
            borderRadius: BorderRadius.circular(trackHeight / 2),
            border: Border.all(
              color: const Color(0x4D60A5FA),
              width: 1.0,
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: padding),
          child: Stack(
            alignment: Alignment.centerLeft,
            children: [
              // Center Label ("Slide to get started")
              Center(
                child: Opacity(
                  opacity: (1.0 - (progress * 1.5)).clamp(0.0, 1.0),
                  child: Text(
                    widget.text,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14.5,
                      fontWeight: FontWeight.w500,
                      letterSpacing: -0.2,
                    ),
                  ),
                ),
              ),

              // Right Endcap Circle (Checkmark icon)
              Align(
                alignment: Alignment.centerRight,
                child: Container(
                  width: thumbSize,
                  height: thumbSize,
                  decoration: BoxDecoration(
                    color: const Color(0xFF121620).withOpacity(0.85),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0x33FFFFFF),
                      width: 1.0,
                    ),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.check_rounded,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                ),
              ),

              // Left Draggable Thumb (Royal Blue Circle with Chevron)
              Positioned(
                left: _dragPosition,
                child: GestureDetector(
                  onHorizontalDragUpdate: (details) => _onDragUpdate(details, maxDrag),
                  onHorizontalDragEnd: (details) => _onDragEnd(details, maxDrag),
                  child: Container(
                    width: thumbSize,
                    height: thumbSize,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.chevron_right_rounded,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
