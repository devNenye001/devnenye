class PowerMetrics {
  final double voltage; // Volts (from PZEM-004T)
  final double current; // Amperes
  final double power; // Active Power in Watts
  final double energy; // Accumulated Energy in kWh
  final double frequency; // Frequency in Hertz (typically 50/60Hz)
  final double powerFactor; // 0.00 to 1.00
  final DateTime timestamp;

  const PowerMetrics({
    required this.voltage,
    required this.current,
    required this.power,
    required this.energy,
    required this.frequency,
    required this.powerFactor,
    required this.timestamp,
  });

  factory PowerMetrics.zero() {
    return PowerMetrics(
      voltage: 0.0,
      current: 0.0,
      power: 0.0,
      energy: 0.0,
      frequency: 50.0,
      powerFactor: 1.0,
      timestamp: DateTime.now(),
    );
  }

  factory PowerMetrics.fromJson(Map<String, dynamic> json) {
    return PowerMetrics(
      voltage: (json['voltage'] as num?)?.toDouble() ?? 0.0,
      current: (json['current'] as num?)?.toDouble() ?? 0.0,
      power: (json['power'] as num?)?.toDouble() ?? 0.0,
      energy: (json['energy'] as num?)?.toDouble() ?? 0.0,
      frequency: (json['frequency'] as num?)?.toDouble() ?? 50.0,
      powerFactor: (json['powerFactor'] as num?)?.toDouble() ?? 1.0,
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'voltage': voltage,
      'current': current,
      'power': power,
      'energy': energy,
      'frequency': frequency,
      'powerFactor': powerFactor,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  PowerMetrics copyWith({
    double? voltage,
    double? current,
    double? power,
    double? energy,
    double? frequency,
    double? powerFactor,
    DateTime? timestamp,
  }) {
    return PowerMetrics(
      voltage: voltage ?? this.voltage,
      current: current ?? this.current,
      power: power ?? this.power,
      energy: energy ?? this.energy,
      frequency: frequency ?? this.frequency,
      powerFactor: powerFactor ?? this.powerFactor,
      timestamp: timestamp ?? this.timestamp,
    );
  }
}

