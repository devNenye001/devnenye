import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/socket_item_model.dart';
import '../providers/socket_provider.dart';
import '../widgets/custom_toggle_switch.dart';

class EditSocketScreen extends StatefulWidget {
  final SocketItemModel? socket;
  final bool isNew;

  const EditSocketScreen({
    super.key,
    this.socket,
    this.isNew = false,
  });

  @override
  State<EditSocketScreen> createState() => _EditSocketScreenState();
}

class _EditSocketScreenState extends State<EditSocketScreen> {
  late TextEditingController _nameController;
  late String _selectedRoomId;
  late bool _isOn;
  late bool _isScheduleEnabled;
  late int _scheduleYear;
  late String _scheduleMonth;
  late int _scheduleDay;
  late String _onTime;
  late String _offTime;

  @override
  void initState() {
    super.initState();
    final s = widget.socket;
    _nameController = TextEditingController(
      text: s?.name ?? (widget.isNew ? 'Smart Socket' : 'Socket 1'),
    );
    _selectedRoomId = s?.roomId ?? 'kitchen';
    _isOn = s?.isOn ?? true;
    _isScheduleEnabled = s?.isScheduleEnabled ?? true;
    _scheduleYear = s?.scheduleYear ?? 2025;
    _scheduleMonth = s?.scheduleMonth ?? 'Sept';
    _scheduleDay = s?.scheduleDay ?? 7;
    _onTime = s?.onTime ?? '08:00 AM';
    _offTime = s?.offTime ?? '13:00 PM';
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _onDone() {
    final socketProv = context.read<SocketProvider>();
    final name = _nameController.text.trim().isEmpty
        ? 'Smart Socket'
        : _nameController.text.trim();

    if (widget.isNew || widget.socket == null) {
      socketProv.addSocket(name: name, roomId: _selectedRoomId);
    } else {
      final updated = widget.socket!.copyWith(
        name: name,
        roomId: _selectedRoomId,
        isOn: _isOn,
        isScheduleEnabled: _isScheduleEnabled,
        scheduleYear: _scheduleYear,
        scheduleMonth: _scheduleMonth,
        scheduleDay: _scheduleDay,
        onTime: _onTime,
        offTime: _offTime,
      );
      socketProv.updateSocketDetails(updated);
    }

    Navigator.pop(context);
  }

  void _selectRoomDialog() {
    final socketProv = context.read<SocketProvider>();
    final rooms = socketProv.rooms;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(24),
              topRight: Radius.circular(24),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Select Room',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              ...rooms.map((r) {
                final isSelected = r.id == _selectedRoomId;
                return ListTile(
                  title: Text(
                    r.name,
                    style: TextStyle(
                      color: isSelected ? AppColors.primary : Colors.white,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    ),
                  ),
                  trailing: isSelected
                      ? const Icon(Icons.check_rounded, color: AppColors.primary)
                      : null,
                  onTap: () {
                    setState(() => _selectedRoomId = r.id);
                    Navigator.pop(ctx);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickTime({required bool isOnTime}) async {
    final initialTime = isOnTime
        ? const TimeOfDay(hour: 8, minute: 0)
        : const TimeOfDay(hour: 13, minute: 0);

    final picked = await showTimePicker(
      context: context,
      initialTime: initialTime,
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppColors.primary,
              surface: AppColors.surface,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      final hour = picked.hour.toString().padLeft(2, '0');
      final minute = picked.minute.toString().padLeft(2, '0');
      final period = picked.hour >= 12 ? 'PM' : 'AM';
      setState(() {
        if (isOnTime) {
          _onTime = '$hour:$minute $period';
        } else {
          _offTime = '$hour:$minute $period';
        }
      });
    }
  }

  void _pickDateDialog() {
    showDatePicker(
      context: context,
      initialDate: DateTime(_scheduleYear, 9, _scheduleDay),
      firstDate: DateTime(2024),
      lastDate: DateTime(2030),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppColors.primary,
              surface: AppColors.surface,
            ),
          ),
          child: child!,
        );
      },
    ).then((picked) {
      if (picked != null) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        setState(() {
          _scheduleYear = picked.year;
          _scheduleMonth = months[picked.month - 1];
          _scheduleDay = picked.day;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final socketProv = context.watch<SocketProvider>();
    final currentRoom = socketProv.rooms.firstWhere(
      (r) => r.id == _selectedRoomId,
      orElse: () => socketProv.rooms.first,
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        title: const Text(
          'Edit',
          style: TextStyle(
            color: Colors.white,
            fontSize: 17,
            fontWeight: FontWeight.bold,
            letterSpacing: -0.2,
          ),
        ),
        actions: [
          TextButton(
            onPressed: _onDone,
            child: const Text(
              'Done',
              style: TextStyle(
                color: Colors.white,
                fontSize: 15.5,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 22.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Socket Name Header Row with Toggle Switch
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.socket != null ? widget.socket!.name : 'Smart Socket',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.2,
                    ),
                  ),
                  CustomToggleSwitch(
                    isOn: _isOn,
                    onChanged: (val) => setState(() => _isOn = val),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // 2. Enter socket name field
              const Text(
                'Enter socket name',
                style: TextStyle(
                  color: Color(0xFF8E95A5),
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF182334),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: const Color(0xFF263750),
                    width: 1.0,
                  ),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: TextField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white, fontSize: 14.5),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),

              const SizedBox(height: 22),

              // 3. Enter room name dropdown
              const Text(
                'Enter room name',
                style: TextStyle(
                  color: Color(0xFF8E95A5),
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: _selectRoomDialog,
                behavior: HitTestBehavior.opaque,
                child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    color: const Color(0xFF182334),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: const Color(0xFF263750),
                      width: 1.0,
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        currentRoom.name,
                        style: const TextStyle(color: Colors.white, fontSize: 14.5),
                      ),
                      const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: Color(0xFF8E95A5),
                        size: 22,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // 4. Schedule Card
              Container(
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: const Color(0xFF2A2B33),
                    width: 0.8,
                  ),
                ),
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Schedule Header Row with Toggle
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Schedule',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        CustomToggleSwitch(
                          isOn: _isScheduleEnabled,
                          onChanged: (val) => setState(() => _isScheduleEnabled = val),
                        ),
                      ],
                    ),

                    const SizedBox(height: 14),
                    const Divider(color: Color(0xFF2E323B), height: 1),
                    const SizedBox(height: 18),

                    // Date Selectors (Year, Month, Day pills)
                    Row(
                      children: [
                        _buildDatePill(
                          label: '$_scheduleYear',
                          onTap: _pickDateDialog,
                        ),
                        const SizedBox(width: 10),
                        _buildDatePill(
                          label: _scheduleMonth,
                          onTap: _pickDateDialog,
                        ),
                        const SizedBox(width: 10),
                        _buildDatePill(
                          label: '$_scheduleDay',
                          onTap: _pickDateDialog,
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // On Time & Off Time Row
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _pickTime(isOnTime: true),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'On Time',
                                  style: TextStyle(
                                    color: Color(0xFF8E95A5),
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  _onTime,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 15.5,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Container(
                          width: 1,
                          height: 36,
                          color: const Color(0xFF2E323B),
                          margin: const EdgeInsets.symmetric(horizontal: 14),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _pickTime(isOnTime: false),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Off Time',
                                  style: TextStyle(
                                    color: Color(0xFF8E95A5),
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  _offTime,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 15.5,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // Home indicator line
              Center(
                child: Container(
                  width: 135,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.35),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDatePill({required String label, required VoidCallback onTap}) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: 38,
          decoration: BoxDecoration(
            color: const Color(0xFF212530),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: const Color(0xFF333B4D),
              width: 0.8,
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(width: 4),
              const Icon(
                Icons.keyboard_arrow_down_rounded,
                color: Color(0xFF8E95A5),
                size: 16,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
