import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/socket_provider.dart';
import '../views/rooms/widgets/room_card.dart';
import 'add_new_modal.dart';
import 'room_detail_screen.dart';

class RoomsScreen extends StatelessWidget {
  final ValueChanged<int>? onNavigateToTab;

  const RoomsScreen({
    super.key,
    this.onNavigateToTab,
  });

  @override
  Widget build(BuildContext context) {
    final socketProv = context.watch<SocketProvider>();
    final rooms = socketProv.rooms;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 1. Blue Header Area
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 160,
            child: Container(
              color: AppColors.headerBlue,
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const SizedBox(width: 40),
                      Text(
                        'Rooms(${rooms.length})',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16.5,
                          fontWeight: FontWeight.w600,
                          letterSpacing: -0.2,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add, color: Colors.white, size: 24),
                        splashRadius: 22,
                        onPressed: () => AddNewModal.show(context),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // 2. Dark Body Sheet with rounded top corners
          Positioned.fill(
            top: 115,
            child: Container(
              decoration: const BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: ListView.builder(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 110),
                itemCount: rooms.length,
                itemBuilder: (context, index) {
                  final room = rooms[index];
                  return RoomCard(
                    room: room,
                    onTap: () {
                      socketProv.selectRoom(room.id);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => RoomDetailScreen(room: room),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
