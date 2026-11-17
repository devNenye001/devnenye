class RoomItemModel {
  final String id;
  final String name;
  final int activeSockets;
  final double currentUsageKw;
  final String imageAsset;

  const RoomItemModel({
    required this.id,
    required this.name,
    required this.activeSockets,
    required this.currentUsageKw,
    required this.imageAsset,
  });

  RoomItemModel copyWith({
    String? id,
    String? name,
    int? activeSockets,
    double? currentUsageKw,
    String? imageAsset,
  }) {
    return RoomItemModel(
      id: id ?? this.id,
      name: name ?? this.name,
      activeSockets: activeSockets ?? this.activeSockets,
      currentUsageKw: currentUsageKw ?? this.currentUsageKw,
      imageAsset: imageAsset ?? this.imageAsset,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'activeSockets': activeSockets,
      'currentUsageKw': currentUsageKw,
      'imageAsset': imageAsset,
    };
  }

  factory RoomItemModel.fromJson(Map<String, dynamic> json) {
    return RoomItemModel(
      id: json['id'] as String,
      name: json['name'] as String,
      activeSockets: json['activeSockets'] as int? ?? 0,
      currentUsageKw: (json['currentUsageKw'] as num?)?.toDouble() ?? 0.0,
      imageAsset: json['imageAsset'] as String? ?? 'assets/images/bedroom_photo.png',
    );
  }
}

