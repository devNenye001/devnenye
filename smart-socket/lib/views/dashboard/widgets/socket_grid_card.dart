import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../models/socket_item_model.dart';
import '../../../widgets/socket_outlet_icon.dart';
import '../../../widgets/custom_toggle_switch.dart';

class SocketGridCard extends StatelessWidget {
  final SocketItemModel socket;
  final ValueChanged<bool> onToggle;
  final VoidCallback onEdit;

  const SocketGridCard({
    super.key,
    required this.socket,
    required this.onToggle,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardSocket,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF2A2B32),
          width: 0.8,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(15.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Top row: Outlet icon on left, circular edit pencil on right
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const SocketOutletIcon(size: 28),
              GestureDetector(
                onTap: onEdit,
                child: Container(
                  width: 30,
                  height: 30,
                  decoration: const BoxDecoration(
                    color: Color(0xFF28282E),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.edit_outlined,
                      size: 14,
                      color: Color(0xFFB0B5C0),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Middle: Socket Name
          Padding(
            padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
            child: Text(
              socket.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 15.5,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.2,
              ),
            ),
          ),

          // Bottom: Toggle Switch aligned to bottom right
          Align(
            alignment: Alignment.bottomRight,
            child: CustomToggleSwitch(
              isOn: socket.isOn,
              onChanged: onToggle,
            ),
          ),
        ],
      ),
    );
  }
}

