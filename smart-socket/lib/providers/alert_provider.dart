import 'package:flutter/foundation.dart';
import '../models/ai_safety_alert.dart';
import '../services/notification_service.dart';
import '../services/voice_service.dart';
import '../services/storage_service.dart';

class AlertProvider extends ChangeNotifier {
  final List<AiSafetyAlert> _alerts = [];
  final VoiceService _voiceService = VoiceService();
  final NotificationService _notificationService = NotificationService();
  StorageService? _storageService;

  bool _voiceEnabled = true;
  bool get voiceEnabled => _voiceEnabled;

  List<AiSafetyAlert> get alerts => List.unmodifiable(_alerts);
  int get unreadCount => _alerts.length;

  Future<void> init(StorageService storage) async {
    _storageService = storage;
    _voiceEnabled = storage.voiceAlertsEnabled;
    _voiceService.isEnabled = _voiceEnabled;
    await _voiceService.init();
    await _notificationService.init();

    final saved = storage.loadAlerts();
    if (saved.isNotEmpty) {
      _alerts.addAll(saved);
    } else {
      // Seed with initial welcoming alert
      _alerts.add(
        AiSafetyAlert(
          id: 'init_1',
          type: AlertType.normalSafe,
          severity: AlertSeverity.info,
          title: 'AIoT Safety Engine Active',
          message:
              'Continuous power monitoring and TinyML predictive protection are armed.',
          voiceText: 'AIoT Smart Socket is armed and monitoring power safely.',
          timestamp: DateTime.now().subtract(const Duration(minutes: 10)),
          wasRelayCutoff: false,
        ),
      );
    }
    notifyListeners();
  }

  void setVoiceEnabled(bool enabled) {
    _voiceEnabled = enabled;
    _voiceService.isEnabled = enabled;
    _storageService?.setVoiceAlertsEnabled(enabled);
    notifyListeners();
  }

  Future<void> handleNewAlert(AiSafetyAlert alert) async {
    // Avoid spamming duplicate alerts within 5 seconds
    if (_alerts.isNotEmpty &&
        _alerts.first.type == alert.type &&
        DateTime.now().difference(_alerts.first.timestamp).inSeconds < 5) {
      return;
    }

    _alerts.insert(0, alert);
    if (_alerts.length > 50) _alerts.removeLast();
    _storageService?.saveAlerts(_alerts);
    notifyListeners();

    // Trigger local push notification
    await _notificationService.showSafetyAlert(alert);

    // Trigger voice alert if enabled
    if (_voiceEnabled) {
      await _voiceService.speak(alert.voiceText);
    }
  }

  Future<void> replayVoiceAlert(AiSafetyAlert alert) async {
    await _voiceService.speak(alert.voiceText);
  }

  void clearAlerts() {
    _alerts.clear();
    _storageService?.saveAlerts(_alerts);
    notifyListeners();
  }
}

