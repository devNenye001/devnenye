import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/room_item_model.dart';
import '../providers/socket_provider.dart';
import '../widgets/floating_bottom_nav_bar.dart';
import '../widgets/swipeable_socket_tile.dart';
import '../views/dashboard/widgets/energy_usage_card.dart';
import 'add_new_modal.dart';
import 'edit_socket_screen.dart';

class RoomDetailScreen extends StatelessWidget {
  final RoomItemModel room;

  const RoomDetailScreen({
    super.key,
    required this.room,
  });

  @override
  Widget build(BuildContext context) {
    final socketProv = context.watch<SocketProvider>();
    final sockets = socketProv.allSockets.where((s) => s.roomId == room.id).toList();
    final activeSocketsCount = sockets.where((s) => s.isOn).length;

    // Use room's current usage or default
    final usageKw = room.currentUsageKw > 0 ? room.currentUsageKw : 48.2;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 1. Hero Room Photographic Background Header
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 220,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(
                  room.imageAsset,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(color: const Color(0xFF1E2638));
                  },
                ),
                // Gradient scrim overlay for contrast
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black.withOpacity(0.55),
                        Colors.black.withOpacity(0.2),
                        Colors.black.withOpacity(0.7),
                      ],
                    ),
                  ),
                ),
                // Top Nav Bar
                SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
                          onPressed: () => Navigator.pop(context),
                        ),
                        Text(
                          room.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            letterSpacing: -0.2,
                          ),
                        ),
                        const SizedBox(width: 48), // Balance leading back button
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // 2. Dark Body Sheet with rounded top corners
          Positioned.fill(
            top: 175,
            child: Container(
              decoration: const BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
            ),
          ),

          // 3. Scrollable Content (Overlapping Energy Usage card + Sockets list)
          Positioned.fill(
            top: 85,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 120),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Floating Energy Usage Card for this Room
                  EnergyUsageCard(
                    activeSockets: activeSocketsCount,
                    todayUsageKw: usageKw,
                  ),

                  const SizedBox(height: 24),

                  // Section Header: "Sockets(4)" + "+" button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Sockets(${sockets.length})',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.2,
                        ),
                      ),
                      GestureDetector(
                        onTap: () => AddNewModal.show(context),
                        behavior: HitTestBehavior.opaque,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          child: const Icon(
                            Icons.add,
                            color: Colors.white,
                            size: 22,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Vertical List of Sockets with Swipeable Edit & Delete
                  if (sockets.isEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 40),
                      alignment: Alignment.center,
                      child: const Text(
                        'No sockets in this room yet.\nTap + to add one.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 14),
                      ),
                    )
                  else
                    ...sockets.map((socket) {
                      return SwipeableSocketTile(
                        socket: socket,
                        onToggle: (val) => socketProv.toggleSocket(socket.id),
                        onEdit: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => EditSocketScreen(socket: socket),
                            ),
                          );
                        },
                        onDelete: () {
                          socketProv.deleteSocket(socket.id);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('${socket.name} deleted'),
                              backgroundColor: AppColors.surface,
                              duration: const Duration(seconds: 2),
                            ),
                          );
                        },
                      );
                    }).toList(),
                ],
              ),
            ),
          ),

          // 4. Floating Navigation Bar (Rooms tab active)
          Positioned(
            left: 0,
            right: 0,
            bottom: MediaQuery.of(context).padding.bottom + 8,
            child: FloatingBottomNavBar(
              currentIndex: 1, // Rooms active
              onTap: (index) {
                Navigator.pop(context); // Return to main navigation
              },
            ),
          ),
        ],
      ),
    );
  }
}

