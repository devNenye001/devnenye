import 'dart:async';
import 'dart:math';
import '../models/power_metrics.dart';

enum SimulationPreset {
  normalLivingRoom, // TV + lamps (~120W)
  heavyHeater, // Space Heater (~1800W, 7.8A)
  motorCompressor, // Refrigerator cyclic load
  overloadFault, // Injects dangerous 15A overcurrent
  voltageSurgeFault, // Injects 255V surge
  standbyDrain, // Idle charger / TV standby (~4W)
}

class MockEsp32Simulator {
  final _random = Random();
  Timer? _telemetryTimer;
  SimulationPreset currentPreset = SimulationPreset.normalLivingRoom;

  bool isRelayClosed = true;
  double _accumulatedKwh = 12.845;
  double _baseVoltage = 230.0;

  final _streamController = StreamController<PowerMetrics>.broadcast();
  Stream<PowerMetrics> get telemetryStream => _streamController.stream;

  void start() {
    _telemetryTimer?.cancel();
    _telemetryTimer = Timer.periodic(const Duration(milliseconds: 1000), (_) {
      _emitSample();
    });
  }

  void stop() {
    _telemetryTimer?.cancel();
  }

  void setRelay(bool state) {
    isRelayClosed = state;
    _emitSample();
  }

  void triggerPreset(SimulationPreset preset) {
    currentPreset = preset;
    _emitSample();
  }

  void _emitSample() {
    if (!isRelayClosed) {
      // Relay is OFF -> Zero load flowing through socket contacts
      final zeroMetrics = PowerMetrics(
        voltage: _baseVoltage + (_random.nextDouble() - 0.5) * 2.0,
        current: 0.0,
        power: 0.0,
        energy: _accumulatedKwh,
        frequency: 50.0 + (_random.nextDouble() - 0.5) * 0.1,
        powerFactor: 1.0,
        timestamp: DateTime.now(),
      );
      _streamController.add(zeroMetrics);
      return;
    }

    double voltage = _baseVoltage + (_random.nextDouble() - 0.5) * 3.0;
    double current = 0.5;
    double pf = 0.96;
    double freq = 50.0 + (_random.nextDouble() - 0.5) * 0.15;

    switch (currentPreset) {
      case SimulationPreset.normalLivingRoom:
        current = 0.65 + (_random.nextDouble() * 0.15); // ~150W
        pf = 0.95;
        break;
      case SimulationPreset.heavyHeater:
        current = 8.2 + (_random.nextDouble() * 0.4); // ~1900W
        pf = 0.99; // Pure resistive load
        break;
      case SimulationPreset.motorCompressor:
        current = 2.4 + sin(DateTime.now().second * 0.2) * 1.2; // Cyclical
        pf = 0.78; // Inductive motor load
        break;
      case SimulationPreset.overloadFault:
        current = 14.8 + (_random.nextDouble() * 1.5); // Overcurrent dangerous condition
        pf = 0.94;
        break;
      case SimulationPreset.voltageSurgeFault:
        voltage = 258.0 + (_random.nextDouble() * 4.0); // Severe overvoltage
        current = 3.5;
        pf = 0.92;
        break;
      case SimulationPreset.standbyDrain:
        current = 0.02 + (_random.nextDouble() * 0.01); // ~4 Watts vampire drain
        pf = 0.62;
        break;
    }

    double power = voltage * current * pf;
    // Accumulate energy: kWh = (Watts * hours)
    _accumulatedKwh += (power / 1000.0) * (1.0 / 3600.0);

    final metrics = PowerMetrics(
      voltage: double.parse(voltage.toStringAsFixed(1)),
      current: double.parse(current.toStringAsFixed(2)),
      power: double.parse(power.toStringAsFixed(1)),
      energy: double.parse(_accumulatedKwh.toStringAsFixed(4)),
      frequency: double.parse(freq.toStringAsFixed(2)),
      powerFactor: double.parse(pf.toStringAsFixed(2)),
      timestamp: DateTime.now(),
    );

    _streamController.add(metrics);
  }

  void dispose() {
    _telemetryTimer?.cancel();
    _streamController.close();
  }
}

