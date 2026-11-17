import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/socket_device.dart';
import '../models/power_metrics.dart';
import '../models/ai_safety_alert.dart';
import '../models/socket_item_model.dart';
import '../models/room_item_model.dart';
import '../services/mock_esp32_simulator.dart';
import '../services/esp32_iot_service.dart';
import '../services/tinyml_ai_engine.dart';
import '../services/storage_service.dart';
import 'alert_provider.dart';

class SocketProvider extends ChangeNotifier {
  SocketDevice _device = SocketDevice.defaultDevice();
  PowerMetrics _currentMetrics = PowerMetrics.zero();
  
  // Historical telemetry buffers for live charts (retaining latest 30 samples)
  final List<PowerMetrics> _history = [];
  List<PowerMetrics> get history => List.unmodifiable(_history);

  final MockEsp32Simulator _simulator = MockEsp32Simulator();
  final Esp32IotService _iotService = Esp32IotService();
  final TinyMlAiEngine _aiEngine = TinyMlAiEngine();
  
  StreamSubscription<PowerMetrics>? _telemetrySub;
  AlertProvider? _alertProvider;
  StorageService? _storageService;

  bool _isUsingSimulator = true;
  bool get isUsingSimulator => _isUsingSimulator;
  bool get isMqttConnected => _iotService.isConnected;

  SocketDevice get device => _device;
  PowerMetrics get metrics => _currentMetrics;
  TinyMlAiEngine get aiEngine => _aiEngine;
  MockEsp32Simulator get simulator => _simulator;

  // --- Multi-Socket & Room Management ---
  String _selectedRoomId = 'bedroom';
  String get selectedRoomId => _selectedRoomId;

  final List<RoomItemModel> _rooms = [
    const RoomItemModel(
      id: 'bedroom',
      name: 'Bedroom',
      activeSockets: 4,
      currentUsageKw: 46.2,
      imageAsset: 'assets/images/bedroom_photo.png',
    ),
    const RoomItemModel(
      id: 'kitchen',
      name: 'Kitchen',
      activeSockets: 3,
      currentUsageKw: 13.8,
      imageAsset: 'assets/images/kitchen_photo.png',
    ),
    const RoomItemModel(
      id: 'living_room',
      name: 'Living Room',
      activeSockets: 5,
      currentUsageKw: 76.2,
      imageAsset: 'assets/images/living_photo.png',
    ),
  ];

  final List<SocketItemModel> _sockets = [
    // Bedroom sockets (4 sockets)
    const SocketItemModel(id: 'bed_1', name: 'Socket 1', roomId: 'bedroom', isOn: true, powerUsageKw: 11.5),
    const SocketItemModel(id: 'bed_2', name: 'Socket 2', roomId: 'bedroom', isOn: true, powerUsageKw: 14.2),
    const SocketItemModel(id: 'bed_3', name: 'Socket 3', roomId: 'bedroom', isOn: true, powerUsageKw: 8.5),
    const SocketItemModel(id: 'bed_4', name: 'Socket 4', roomId: 'bedroom', isOn: true, powerUsageKw: 12.0),

    // Living Room sockets (5 sockets)
    const SocketItemModel(id: 'liv_1', name: 'Socket 1', roomId: 'living_room', isOn: true, powerUsageKw: 18.2),
    const SocketItemModel(id: 'liv_2', name: 'Socket 2', roomId: 'living_room', isOn: true, powerUsageKw: 22.0),
    const SocketItemModel(id: 'liv_3', name: 'Socket 3', roomId: 'living_room', isOn: true, powerUsageKw: 14.0),
    const SocketItemModel(id: 'liv_4', name: 'Socket 4', roomId: 'living_room', isOn: true, powerUsageKw: 10.0),
    const SocketItemModel(id: 'liv_5', name: 'Socket 5', roomId: 'living_room', isOn: true, powerUsageKw: 12.0),

    // Kitchen sockets (3 sockets)
    const SocketItemModel(id: 'kitch_1', name: 'Socket 1', roomId: 'kitchen', isOn: true, powerUsageKw: 4.8),
    const SocketItemModel(id: 'kitch_2', name: 'Socket 2', roomId: 'kitchen', isOn: true, powerUsageKw: 5.2),
    const SocketItemModel(id: 'kitch_3', name: 'Socket 3', roomId: 'kitchen', isOn: true, powerUsageKw: 3.8),

    // Remaining background sockets in house to total exactly 17 active sockets
    const SocketItemModel(id: 'bg_1', name: 'Office Socket 1', roomId: 'other', isOn: true, powerUsageKw: 1.2),
    const SocketItemModel(id: 'bg_2', name: 'Office Socket 2', roomId: 'other', isOn: true, powerUsageKw: 1.5),
    const SocketItemModel(id: 'bg_3', name: 'Hallway Socket', roomId: 'other', isOn: true, powerUsageKw: 0.8),
    const SocketItemModel(id: 'bg_4', name: 'Balcony Socket', roomId: 'other', isOn: true, powerUsageKw: 0.9),
    const SocketItemModel(id: 'bg_5', name: 'Bathroom Socket', roomId: 'other', isOn: true, powerUsageKw: 1.1),
  ];

  List<RoomItemModel> get rooms => List.unmodifiable(_rooms);
  List<SocketItemModel> get allSockets => List.unmodifiable(_sockets);

  List<SocketItemModel> get socketsForSelectedRoom {
    return _sockets.where((s) => s.roomId == _selectedRoomId).toList();
  }

  int get totalActiveSockets {
    return _sockets.where((s) => s.isOn).length;
  }

  double get todayUsageKw {
    return 76.2;
  }

  void selectRoom(String roomId) {
    if (_selectedRoomId != roomId) {
      _selectedRoomId = roomId;
      notifyListeners();
    }
  }

  void toggleSocket(String socketId) {
    final index = _sockets.indexWhere((s) => s.id == socketId);
    if (index != -1) {
      final updated = _sockets[index].copyWith(isOn: !_sockets[index].isOn);
      _sockets[index] = updated;

      // Update room active socket count
      _updateRoomSocketCounts();

      // If this is the primary selected socket, sync with hardware relay
      if (index == 0) {
        toggleRelay(forcedState: updated.isOn);
      } else {
        notifyListeners();
      }
    }
  }

  void _updateRoomSocketCounts() {
    for (int i = 0; i < _rooms.length; i++) {
      final r = _rooms[i];
      final activeCount = _sockets.where((s) => s.roomId == r.id && s.isOn).length;
      _rooms[i] = r.copyWith(activeSockets: activeCount);
    }
    notifyListeners();
  }

  void renameSocket(String socketId, String newName) {
    final index = _sockets.indexWhere((s) => s.id == socketId);
    if (index != -1) {
      _sockets[index] = _sockets[index].copyWith(name: newName);
      notifyListeners();
    }
  }

  void updateSocketDetails(SocketItemModel updatedSocket) {
    final index = _sockets.indexWhere((s) => s.id == updatedSocket.id);
    if (index != -1) {
      _sockets[index] = updatedSocket;
      _updateRoomSocketCounts();
      notifyListeners();
    }
  }

  void deleteSocket(String socketId) {
    _sockets.removeWhere((s) => s.id == socketId);
    _updateRoomSocketCounts();
    notifyListeners();
  }

  void addSocket({required String name, required String roomId}) {
    final newId = 'sock_${DateTime.now().millisecondsSinceEpoch}';
    _sockets.add(
      SocketItemModel(
        id: newId,
        name: name,
        roomId: roomId,
        isOn: true,
        powerUsageKw: 1.0,
      ),
    );
    _updateRoomSocketCounts();
    notifyListeners();
  }

  void addRoom({required String name, String? imageAsset}) {
    final newId = name.toLowerCase().replaceAll(' ', '_');
    _rooms.add(
      RoomItemModel(
        id: newId,
        name: name,
        activeSockets: 0,
        currentUsageKw: 0.0,
        imageAsset: imageAsset ?? 'assets/images/bedroom_photo.png',
      ),
    );
    notifyListeners();
  }

  // --- Initialization ---
  Future<void> init(StorageService storage, AlertProvider alertProvider) async {
    _storageService = storage;
    _alertProvider = alertProvider;
    _device = storage.loadDevice();
    
    // Start with high-fidelity ESP32 simulator active for immediate responsiveness
    _startSimulatorStream();
    _updateRoomSocketCounts();
    notifyListeners();
  }

  void _startSimulatorStream() {
    _telemetrySub?.cancel();
    _simulator.setRelay(_device.isRelayOn);
    _simulator.start();

    _telemetrySub = _simulator.telemetryStream.listen((metrics) {
      _processIncomingMetrics(metrics);
    });
  }

  void _processIncomingMetrics(PowerMetrics newMetrics) {
    _currentMetrics = newMetrics;
    _history.add(newMetrics);
    if (_history.length > 30) {
      _history.removeAt(0);
    }

    // AI Safety Evaluation
    if (_device.isRelayOn && _device.aiProtectionEnabled) {
      final alert = _aiEngine.evaluateSafety(
        newMetrics,
        isRelayOn: _device.isRelayOn,
        aiProtectionEnabled: _device.aiProtectionEnabled,
        maxCurrentLimit: _device.maxCurrentLimit,
      );

      if (alert != null) {
        _alertProvider?.handleNewAlert(alert);

        // If safety trip occurred, immediately switch off the relay
        if (alert.wasRelayCutoff && _device.autoTripEnabled) {
          executeEmergencyTrip(reason: alert.title);
        }
      }
    }

    notifyListeners();
  }

  // Toggle Relay ON / OFF
  Future<void> toggleRelay({bool? forcedState}) async {
    final newState = forcedState ?? !_device.isRelayOn;
    _device = _device.copyWith(isRelayOn: newState);
    _storageService?.saveDevice(_device);

    if (_isUsingSimulator) {
      _simulator.setRelay(newState);
    } else {
      await _iotService.sendRelayCommand(_device.id, newState);
      await _iotService.controlRelayViaHttp(_device.ipAddress, newState);
    }

    // Log user manual control
    _alertProvider?.handleNewAlert(
      AiSafetyAlert(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: AlertType.manualRelayToggle,
        severity: AlertSeverity.info,
        title: newState ? 'Socket Switched ON' : 'Socket Switched OFF',
        message: 'Socket output was turned ${newState ? 'ON' : 'OFF'} manually.',
        voiceText: 'Smart socket ${newState ? 'switched ON' : 'switched OFF'}.',
        timestamp: DateTime.now(),
        wasRelayCutoff: false,
      ),
    );

    notifyListeners();
  }

  // Emergency Safety Trip
  void executeEmergencyTrip({required String reason}) {
    _device = _device.copyWith(isRelayOn: false);
    _storageService?.saveDevice(_device);

    if (_isUsingSimulator) {
      _simulator.setRelay(false);
    } else {
      _iotService.sendRelayCommand(_device.id, false);
      _iotService.controlRelayViaHttp(_device.ipAddress, false);
    }

    // Also switch off primary socket in selected room
    if (_sockets.isNotEmpty) {
      _sockets[0] = _sockets[0].copyWith(isOn: false);
      _updateRoomSocketCounts();
    }

    notifyListeners();
  }

  // Set AI Protection Mode
  void setAiProtection(bool enabled) {
    _device = _device.copyWith(aiProtectionEnabled: enabled);
    _storageService?.saveDevice(_device);
    notifyListeners();
  }

  // Set Auto-Trip Mode
  void setAutoTrip(bool enabled) {
    _device = _device.copyWith(autoTripEnabled: enabled);
    _storageService?.saveDevice(_device);
    notifyListeners();
  }

  // Update Max Current Limit
  void setMaxCurrentLimit(double limit) {
    _device = _device.copyWith(maxCurrentLimit: limit);
    _storageService?.saveDevice(_device);
    notifyListeners();
  }

  // Switch between Hardware MQTT and Simulator
  Future<void> setUseSimulator(bool useSimulator) async {
    _isUsingSimulator = useSimulator;
    if (_isUsingSimulator) {
      _iotService.disconnect();
      _startSimulatorStream();
    } else {
      _simulator.stop();
      _telemetrySub?.cancel();
      final connected = await _iotService.connectMqtt(
        broker: 'broker.hivemq.com',
        port: 1883,
        socketId: _device.id,
      );
      if (connected) {
        _telemetrySub = _iotService.telemetryStream.listen((m) {
          _processIncomingMetrics(m);
        });
      }
    }
    notifyListeners();
  }

  // Fault simulation shortcuts for UI demonstration
  void simulateOverloadTrip() {
    _simulator.triggerPreset(SimulationPreset.overloadFault);
  }

  void simulateVoltageSurge() {
    _simulator.triggerPreset(SimulationPreset.voltageSurgeFault);
  }

  void simulateStandbyDrain() {
    _simulator.triggerPreset(SimulationPreset.standbyDrain);
  }

  void simulateHeavyHeater() {
    _simulator.triggerPreset(SimulationPreset.heavyHeater);
  }

  void simulateNormalLoad() {
    _simulator.triggerPreset(SimulationPreset.normalLivingRoom);
  }

  @override
  void dispose() {
    _telemetrySub?.cancel();
    _simulator.dispose();
    _iotService.dispose();
    super.dispose();
  }
}
