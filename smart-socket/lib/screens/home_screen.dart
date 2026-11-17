import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/socket_item_model.dart';
import '../providers/socket_provider.dart';
import '../views/dashboard/widgets/energy_usage_card.dart';
import '../views/dashboard/widgets/room_filter_chips.dart';
import '../views/dashboard/widgets/socket_grid_card.dart';
import 'add_new_modal.dart';
import 'edit_socket_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final socketProv = context.watch<SocketProvider>();
    final sockets = socketProv.socketsForSelectedRoom;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 1. Blue top header region
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 220,
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
                      const Text(
                        'Hello, Emma',
                        style: TextStyle(
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

          // 3. Scrollable Content Layer
          Positioned.fill(
            top: 85,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 110),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Floating Energy Usage Card
                  EnergyUsageCard(
                    activeSockets: socketProv.totalActiveSockets,
                    todayUsageKw: socketProv.todayUsageKw,
                  ),

                  const SizedBox(height: 22),

                  // Room Filter Chips ("Bedroom", "Living Room", "Kitchen")
                  RoomFilterChips(
                    rooms: socketProv.rooms,
                    selectedRoomId: socketProv.selectedRoomId,
                    onSelectRoom: (id) => socketProv.selectRoom(id),
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

                  // 2x2 Sockets Grid
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: sockets.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                      childAspectRatio: 1.08,
                    ),
                    itemBuilder: (context, index) {
                      final socket = sockets[index];
                      return SocketGridCard(
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
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
