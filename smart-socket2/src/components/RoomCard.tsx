import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { RoomItem } from '../types';

interface RoomCardProps {
  room: RoomItem;
  onPress: (room: RoomItem) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onPress }) => {
  const getImageSource = () => {
    if (room.id === 'room_bedroom' || room.name.toLowerCase().includes('bed')) {
      return require('../assets/rooms/bedroom_clean.png');
    }
    if (room.id === 'room_kitchen' || room.name.toLowerCase().includes('kitch')) {
      return require('../assets/rooms/kitchen_clean.png');
    }
    if (
      room.id === 'room_sitting' ||
      room.name.toLowerCase().includes('sit') ||
      room.name.toLowerCase().includes('liv')
    ) {
      return require('../assets/rooms/living_warm.jpg');
    }
    return { uri: room.imageUrl };
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(room)}
      activeOpacity={0.88}
    >
      {/* Top: Room Image */}
      <Image
        source={getImageSource()}
        style={styles.roomImage}
      />

      {/* Bottom: Info Bar */}
      <View style={styles.infoBar}>
        <View style={styles.leftCol}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.socketsCount}>
            {room.activeSocketsCount} active sockets
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.rightCol}>
          <Text style={styles.usageLabel}>Current usage</Text>
          <Text style={styles.usageValue}>{room.currentUsageKw}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#181C26',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  roomImage: {
    width: '100%',
    height: 145,
    resizeMode: 'cover',
  },
  infoBar: {
    backgroundColor: '#181C26',
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
  },
  roomName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  socketsCount: {
    color: '#8E9AA8',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
  },
  divider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  rightCol: {
    alignItems: 'flex-start',
    minWidth: 105,
  },
  usageLabel: {
    color: '#8E9AA8',
    fontSize: 12,
    fontWeight: '500',
  },
  usageValue: {
    color: '#3B82F6',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 3,
  },
});
