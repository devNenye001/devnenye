import 'package:flutter/foundation.dart';
import '../models/energy_prediction.dart';
import '../models/power_metrics.dart';
import '../services/tinyml_ai_engine.dart';
import '../services/storage_service.dart';

class AiAnalyticsProvider extends ChangeNotifier {
  EnergyPrediction _prediction = EnergyPrediction.initial();
  StorageService? _storageService;
  final TinyMlAiEngine _engine = TinyMlAiEngine();

  EnergyPrediction get prediction => _prediction;
  double get electricityRate => _storageService?.electricityRate ?? 0.15;

  void init(StorageService storage) {
    _storageService = storage;
    notifyListeners();
  }

  void updateWithMetrics(PowerMetrics metrics) {
    _prediction = _engine.generatePrediction(metrics, electricityRate);
    notifyListeners();
  }

  Future<void> updateElectricityRate(double newRate) async {
    await _storageService?.setElectricityRate(newRate);
    notifyListeners();
  }
}

