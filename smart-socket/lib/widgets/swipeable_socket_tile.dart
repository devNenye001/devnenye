import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../models/socket_item_model.dart';
import 'custom_toggle_switch.dart';

class SwipeableSocketTile extends StatefulWidget {
  final SocketItemModel socket;
  final ValueChanged<bool> onToggle;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const SwipeableSocketTile({
    super.key,
    required this.socket,
    required this.onToggle,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  State<SwipeableSocketTile> createState() => _SwipeableSocketTileState();
}

class _SwipeableSocketTileState extends State<SwipeableSocketTile>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _slideAnimation;
  double _dragOffset = 0.0;
  static const double _actionWidth = 140.0; // Width of revealed actions

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 250),
    );
    _slideAnimation = Tween<double>(begin: 0.0, end: 0.0).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onHorizontalDragUpdate(DragUpdateDetails details) {
    setState(() {
      _dragOffset = (_dragOffset + details.primaryDelta!).clamp(-_actionWidth, 0.0);
    });
  }

  void _onHorizontalDragEnd(DragEndDetails details) {
    if (_dragOffset < -_actionWidth * 0.45) {
      // Snap open
      _animateTo(-_actionWidth);
    } else {
      // Snap closed
      _animateTo(0.0);
    }
  }

  void _animateTo(double target) {
    _slideAnimation = Tween<double>(begin: _dragOffset, end: target).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    )..addListener(() {
        setState(() {
          _dragOffset = _slideAnimation.value;
        });
      });
    _controller.forward(from: 0.0);
  }

  void _close() {
    if (_dragOffset != 0.0) {
      _animateTo(0.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
      height: 62.0,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16.0),
        child: Stack(
          children: [
            // 1. Revealed Action Buttons (Edit + Delete) on the right
            Positioned.fill(
              child: Container(
                color: const Color(0xFF1E1E22),
                alignment: Alignment.centerRight,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Orange Edit Action
                    GestureDetector(
                      onTap: () {
                        _close();
                        widget.onEdit();
                      },
                      behavior: HitTestBehavior.opaque,
                      child: Container(
                        width: 70,
                        height: double.infinity,
                        decoration: const BoxDecoration(
                          color: Color(0xFFE65100),
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(14),
                            bottomLeft: Radius.circular(14),
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.edit_outlined, color: Colors.white, size: 18),
                            SizedBox(height: 3),
                            Text(
                              'Edit',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Red Delete Action
                    GestureDetector(
                      onTap: () {
                        _close();
                        widget.onDelete();
                      },
                      behavior: HitTestBehavior.opaque,
                      child: Container(
                        width: 70,
                        height: double.infinity,
                        decoration: const BoxDecoration(
                          color: Color(0xFFDC2626),
                          borderRadius: BorderRadius.only(
                            topRight: Radius.circular(16),
                            bottomRight: Radius.circular(16),
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.delete_outline_rounded, color: Colors.white, size: 18),
                            SizedBox(height: 3),
                            Text(
                              'Delete',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // 2. Sliding Front Content Tile
            Transform.translate(
              offset: Offset(_dragOffset, 0),
              child: GestureDetector(
                onTap: _close,
                onHorizontalDragUpdate: _onHorizontalDragUpdate,
                onHorizontalDragEnd: _onHorizontalDragEnd,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F24),
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(
                      color: const Color(0xFF28282E),
                      width: 0.8,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.socket.name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15.5,
                          fontWeight: FontWeight.w600,
                          letterSpacing: -0.2,
                        ),
                      ),
                      CustomToggleSwitch(
                        isOn: widget.socket.isOn,
                        onChanged: widget.onToggle,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

