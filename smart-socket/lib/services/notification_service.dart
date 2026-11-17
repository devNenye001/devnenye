import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/ai_safety_alert.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();
  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;
    try {
      const AndroidInitializationSettings initializationSettingsAndroid =
          AndroidInitializationSettings('@mipmap/ic_launcher');

      const DarwinInitializationSettings initializationSettingsDarwin =
          DarwinInitializationSettings(
        requestAlertPermission: true,
        requestBadgePermission: true,
        requestSoundPermission: true,
      );

      const InitializationSettings initializationSettings =
          InitializationSettings(
        android: initializationSettingsAndroid,
        iOS: initializationSettingsDarwin,
      );

      await _notificationsPlugin.initialize(
        initializationSettings,
        onDidReceiveNotificationResponse: (NotificationResponse response) {
          // Handle notification click
        },
      );
      _isInitialized = true;
    } catch (e) {
      print('NotificationService init error: $e');
    }
  }

  Future<void> showSafetyAlert(AiSafetyAlert alert) async {
    try {
      const AndroidNotificationDetails androidDetails =
          AndroidNotificationDetails(
        'smart_socket_safety_channel',
        'Smart Socket Safety Alerts',
        channelDescription:
            'Critical AI-driven safety shutdowns and power anomaly alerts',
        importance: Importance.max,
        priority: Priority.high,
        ticker: 'Smart Socket Alert',
        playSound: true,
        enableVibration: true,
      );

      const NotificationDetails platformDetails =
          NotificationDetails(android: androidDetails);

      await _notificationsPlugin.show(
        alert.id.hashCode,
        '⚡ ${alert.title}',
        alert.message,
        platformDetails,
      );
    } catch (e) {
      print('NotificationService show error: $e');
    }
  }
}

