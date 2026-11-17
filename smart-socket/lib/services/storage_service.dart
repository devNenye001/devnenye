import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_constants.dart';
import '../models/socket_device.dart';
import '../models/ai_safety_alert.dart';

class StorageService {
  static StorageService? _instance;
  SharedPreferences? _prefs;

  StorageService._();

  static Future<StorageService> getInstance() async {
    if (_instance == null) {
      _instance = StorageService._();
      await _instance!._init();
    }
    return _instance!;
  }

  Future<void> _init() async {
    try {
      _prefs = await SharedPreferences.getInstance();
    } catch (e) {
      print('Warning: SharedPreferences init error, falling back to in-memory: $e');
    }
  }

  // Socket Configuration
  Future<void> saveDevice(SocketDevice device) async {
    if (_prefs == null) return;
    await _prefs!.setString('socket_device_config', jsonEncode(device.toJson()));
  }

  SocketDevice loadDevice() {
    if (_prefs == null) return SocketDevice.defaultDevice();
    final jsonStr = _prefs!.getString('socket_device_config');
    if (jsonStr == null) return SocketDevice.defaultDevice();
    try {
      final map = jsonDecode(jsonStr) as Map<String, dynamic>;
      return SocketDevice.fromJson(map);
    } catch (_) {
      return SocketDevice.defaultDevice();
    }
  }

  // Voice alert preference
  bool get voiceAlertsEnabled => _prefs?.getBool(AppConstants.keyVoiceAlertsEnabled) ?? true;
  Future<void> setVoiceAlertsEnabled(bool value) async {
    await _prefs?.setBool(AppConstants.keyVoiceAlertsEnabled, value);
  }

  // AI Protection preference
  bool get aiProtectionEnabled => _prefs?.getBool(AppConstants.keyAiProtectionEnabled) ?? true;
  Future<void> setAiProtectionEnabled(bool value) async {
    await _prefs?.setBool(AppConstants.keyAiProtectionEnabled, value);
  }

  // Auto trip preference
  bool get autoTripEnabled => _prefs?.getBool(AppConstants.keyAutoTripEnabled) ?? true;
  Future<void> setAutoTripEnabled(bool value) async {
    await _prefs?.setBool(AppConstants.keyAutoTripEnabled, value);
  }

  // Electricity Tariff Rate ($/kWh)
  double get electricityRate => _prefs?.getDouble(AppConstants.keyCostPerKwh) ?? AppConstants.defaultElectricityRate;
  Future<void> setElectricityRate(double rate) async {
    await _prefs?.setDouble(AppConstants.keyCostPerKwh, rate);
  }

  // Save recent alerts
  Future<void> saveAlerts(List<AiSafetyAlert> alerts) async {
    if (_prefs == null) return;
    final list = alerts.take(50).map((a) => a.toJson()).toList();
    await _prefs!.setString('saved_alerts_log', jsonEncode(list));
  }

  List<AiSafetyAlert> loadAlerts() {
    if (_prefs == null) return [];
    final jsonStr = _prefs!.getString('saved_alerts_log');
    if (jsonStr == null) return [];
    try {
      final list = jsonDecode(jsonStr) as List<dynamic>;
      return list.map((item) => AiSafetyAlert.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }
}

