class SocketDevice {
  final String id;
  final String name;
  final String ipAddress;
  final bool isRelayOn;
  final bool isOnline;
  final bool aiProtectionEnabled;
  final bool autoTripEnabled;
  final double maxCurrentLimit;
  final String applianceType;
  final DateTime lastSeen;

  const SocketDevice({
    required this.id,
    required this.name,
    required this.ipAddress,
    required this.isRelayOn,
    required this.isOnline,
    required this.aiProtectionEnabled,
    required this.autoTripEnabled,
    required this.maxCurrentLimit,
    required this.applianceType,
    required this.lastSeen,
  });

  factory SocketDevice.defaultDevice() {
    return SocketDevice(
      id: 'ESP32_SOCKET_01',
      name: 'Living Room Smart Socket',
      ipAddress: '192.168.1.145',
      isRelayOn: true,
      isOnline: true,
      aiProtectionEnabled: true,
      autoTripEnabled: true,
      maxCurrentLimit: 13.0,
      applianceType: 'Electric Iron / Heater',
      lastSeen: DateTime.now(),
    );
  }

  SocketDevice copyWith({
    String? id,
    String? name,
    String? ipAddress,
    bool? isRelayOn,
    bool? isOnline,
    bool? aiProtectionEnabled,
    bool? autoTripEnabled,
    double? maxCurrentLimit,
    String? applianceType,
    DateTime? lastSeen,
  }) {
    return SocketDevice(
      id: id ?? this.id,
      name: name ?? this.name,
      ipAddress: ipAddress ?? this.ipAddress,
      isRelayOn: isRelayOn ?? this.isRelayOn,
      isOnline: isOnline ?? this.isOnline,
      aiProtectionEnabled: aiProtectionEnabled ?? this.aiProtectionEnabled,
      autoTripEnabled: autoTripEnabled ?? this.autoTripEnabled,
      maxCurrentLimit: maxCurrentLimit ?? this.maxCurrentLimit,
      applianceType: applianceType ?? this.applianceType,
      lastSeen: lastSeen ?? this.lastSeen,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'ipAddress': ipAddress,
      'isRelayOn': isRelayOn,
      'isOnline': isOnline,
      'aiProtectionEnabled': aiProtectionEnabled,
      'autoTripEnabled': autoTripEnabled,
      'maxCurrentLimit': maxCurrentLimit,
      'applianceType': applianceType,
      'lastSeen': lastSeen.toIso8601String(),
    };
  }

  factory SocketDevice.fromJson(Map<String, dynamic> json) {
    return SocketDevice(
      id: json['id'] as String? ?? 'ESP32_SOCKET_01',
      name: json['name'] as String? ?? 'Smart Socket',
      ipAddress: json['ipAddress'] as String? ?? '192.168.1.145',
      isRelayOn: json['isRelayOn'] as bool? ?? false,
      isOnline: json['isOnline'] as bool? ?? false,
      aiProtectionEnabled: json['aiProtectionEnabled'] as bool? ?? true,
      autoTripEnabled: json['autoTripEnabled'] as bool? ?? true,
      maxCurrentLimit: (json['maxCurrentLimit'] as num?)?.toDouble() ?? 13.0,
      applianceType: json['applianceType'] as String? ?? 'General Appliance',
      lastSeen: json['lastSeen'] != null
          ? DateTime.parse(json['lastSeen'] as String)
          : DateTime.now(),
    );
  }
}

