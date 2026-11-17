import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../models/room_item_model.dart';

class RoomFilterChips extends StatelessWidget {
  final List<RoomItemModel> rooms;
  final String selectedRoomId;
  final ValueChanged<String> onSelectRoom;

  const RoomFilterChips({
    super.key,
    required this.rooms,
    required this.selectedRoomId,
    required this.onSelectRoom,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: rooms.map((room) {
          final isSelected = room.id == selectedRoomId;
          return Padding(
            padding: const EdgeInsets.only(right: 10.0),
            child: GestureDetector(
              onTap: () => onSelectRoom(room.id),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.chipActiveBg
                      : AppColors.chipInactiveBg,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: AppColors.chipActiveBg.withOpacity(0.35),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ]
                      : null,
                ),
                child: Text(
                  room.name,
                  style: TextStyle(
                    color: isSelected ? Colors.white : AppColors.chipInactiveText,
                    fontSize: 13.5,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

