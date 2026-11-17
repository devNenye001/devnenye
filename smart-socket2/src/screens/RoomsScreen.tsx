import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';
import { RoomCard } from '../components/RoomCard';
import { FloatingNavBar } from '../components/FloatingNavBar';

export const RoomsScreen: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    rooms,
    setSelectedRoom,
    setIsAddModalVisible,
  } = useSocketContext();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Top Blue Header */}
      <View style={styles.blueHeader}>
        <View style={styles.headerBar}>
          <Text style={styles.titleText}>Rooms({rooms.length})</Text>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => setIsAddModalVisible(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Dark Body */}
      <View style={styles.darkBody}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={(selected) => {
                setSelectedRoom(selected);
                setCurrentScreen('roomDetail');
              }}
            />
          ))}

          {/* Bottom spacing for floating navbar */}
          <View style={{ height: 110 }} />
        </ScrollView>
      </View>

      {/* Floating Bottom Nav */}
      <FloatingNavBar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11141C',
  },
  blueHeader: {
    backgroundColor: '#3B82F6',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 14 : 54,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 32,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  plusButton: {
    position: 'absolute',
    right: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  darkBody: {
    flex: 1,
    backgroundColor: '#11141C',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -16,
  },
  scrollContent: {
    paddingTop: 22,
    paddingHorizontal: 18,
  },
});
