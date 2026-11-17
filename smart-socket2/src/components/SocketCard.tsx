import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Edit2 } from 'lucide-react-native';
import { SocketItem } from '../types';

interface SocketCardProps {
  socket: SocketItem;
  onToggle: (id: string) => void;
  onEdit: (socket: SocketItem) => void;
}

const CustomSwitch: React.FC<{
  isOn: boolean;
  onToggle: () => void;
}> = ({ isOn, onToggle }) => {
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  const thumbColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#64748B', '#3B82F6'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggle}
      style={styles.switchTrack}
    >
      <Animated.View
        style={[
          styles.switchThumb,
          {
            transform: [{ translateX }],
            backgroundColor: thumbColor,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export const SocketCard: React.FC<SocketCardProps> = ({ socket, onToggle, onEdit }) => {
  return (
    <View style={styles.card}>
      {/* Top row: Socket icon & Edit button */}
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke="#8E9AA8" strokeWidth="1.6" />
            <Circle cx="8.5" cy="12" r="1.4" fill="#8E9AA8" />
            <Circle cx="15.5" cy="12" r="1.4" fill="#8E9AA8" />
            <Rect x="11.2" y="3.5" width="1.6" height="2.2" rx="0.8" fill="#8E9AA8" />
            <Rect x="11.2" y="18.3" width="1.6" height="2.2" rx="0.8" fill="#8E9AA8" />
          </Svg>
        </View>

        <TouchableOpacity
          onPress={() => onEdit(socket)}
          style={styles.iconContainer}
          activeOpacity={0.7}
        >
          <Edit2 size={14} color="#8E9AA8" />
        </TouchableOpacity>
      </View>

      {/* Middle row: Socket name */}
      <View style={styles.middleRow}>
        <Text style={styles.socketName}>{socket.name}</Text>
      </View>

      {/* Bottom row: Right-aligned toggle switch */}
      <View style={styles.bottomRow}>
        <CustomSwitch
          isOn={socket.isOn}
          onToggle={() => onToggle(socket.id)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#181C26',
    borderRadius: 20,
    padding: 16,
    width: '47.5%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: 16,
    justifyContent: 'space-between',
    minHeight: 146,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#202532',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRow: {
    marginVertical: 14,
  },
  socketName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#121620',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
