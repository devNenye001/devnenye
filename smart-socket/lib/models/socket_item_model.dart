class SocketItemModel {
  final String id;
  final String name;
  final String roomId;
  final bool isOn;
  final double powerUsageKw;
  final bool isScheduleEnabled;
  final int scheduleYear;
  final String scheduleMonth;
  final int scheduleDay;
  final String onTime;
  final String offTime;

  const SocketItemModel({
    required this.id,
    required this.name,
    required this.roomId,
    this.isOn = true,
    this.powerUsageKw = 0.5,
    this.isScheduleEnabled = true,
    this.scheduleYear = 2025,
    this.scheduleMonth = 'Sept',
    this.scheduleDay = 7,
    this.onTime = '08:00 AM',
    this.offTime = '01:00 PM',
  });

  SocketItemModel copyWith({
    String? id,
    String? name,
    String? roomId,
    bool? isOn,
    double? powerUsageKw,
    bool? isScheduleEnabled,
    int? scheduleYear,
    String? scheduleMonth,
    int? scheduleDay,
    String? onTime,
    String? offTime,
  }) {
    return SocketItemModel(
      id: id ?? this.id,
      name: name ?? this.name,
      roomId: roomId ?? this.roomId,
      isOn: isOn ?? this.isOn,
      powerUsageKw: powerUsageKw ?? this.powerUsageKw,
      isScheduleEnabled: isScheduleEnabled ?? this.isScheduleEnabled,
      scheduleYear: scheduleYear ?? this.scheduleYear,
      scheduleMonth: scheduleMonth ?? this.scheduleMonth,
      scheduleDay: scheduleDay ?? this.scheduleDay,
      onTime: onTime ?? this.onTime,
      offTime: offTime ?? this.offTime,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'roomId': roomId,
      'isOn': isOn,
      'powerUsageKw': powerUsageKw,
      'isScheduleEnabled': isScheduleEnabled,
      'scheduleYear': scheduleYear,
      'scheduleMonth': scheduleMonth,
      'scheduleDay': scheduleDay,
      'onTime': onTime,
      'offTime': offTime,
    };
  }

  factory SocketItemModel.fromJson(Map<String, dynamic> json) {
    return SocketItemModel(
      id: json['id'] as String,
      name: json['name'] as String,
      roomId: json['roomId'] as String,
      isOn: json['isOn'] as bool? ?? true,
      powerUsageKw: (json['powerUsageKw'] as num?)?.toDouble() ?? 0.5,
      isScheduleEnabled: json['isScheduleEnabled'] as bool? ?? true,
      scheduleYear: json['scheduleYear'] as int? ?? 2025,
      scheduleMonth: json['scheduleMonth'] as String? ?? 'Sept',
      scheduleDay: json['scheduleDay'] as int? ?? 7,
      onTime: json['onTime'] as String? ?? '08:00 AM',
      offTime: json['offTime'] as String? ?? '01:00 PM',
    );
  }
}
