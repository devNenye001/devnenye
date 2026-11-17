import 'package:flutter_tts/flutter_tts.dart';

class VoiceService {
  static final VoiceService _instance = VoiceService._internal();
  factory VoiceService() => _instance;
  VoiceService._internal();

  FlutterTts? _flutterTts;
  bool _isInitialized = false;
  bool isEnabled = true;

  Future<void> init() async {
    if (_isInitialized) return;
    try {
      _flutterTts = FlutterTts();
      await _flutterTts?.setLanguage('en-US');
      await _flutterTts?.setSpeechRate(0.5);
      await _flutterTts?.setVolume(1.0);
      await _flutterTts?.setPitch(1.0);
      _isInitialized = true;
    } catch (e) {
      print('FlutterTTS initialization skipped on platform: $e');
    }
  }

  Future<void> speak(String text) async {
    if (!isEnabled) return;
    try {
      if (!_isInitialized) {
        await init();
      }
      await _flutterTts?.speak(text);
    } catch (e) {
      print('VoiceService error speaking "$text": $e');
    }
  }

  Future<void> speakSafetyTrip(String deviceName, String reason) async {
    final alertMessage =
        'Warning! The smart socket turned off $deviceName for safety reasons. Reason: $reason.';
    await speak(alertMessage);
  }

  Future<void> speakAnomalyDetected(String detail) async {
    final alertMessage = 'Notice: AI detected an abnormal power pattern. $detail.';
    await speak(alertMessage);
  }

  Future<void> speakForgottenDevice(String deviceName, int minutes) async {
    final alertMessage =
        'Alert! $deviceName has been running continuously for $minutes minutes. Please check your appliance.';
    await speak(alertMessage);
  }

  Future<void> stop() async {
    try {
      await _flutterTts?.stop();
    } catch (_) {}
  }
}

