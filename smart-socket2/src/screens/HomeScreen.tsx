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
import { EnergyCard } from '../components/EnergyCard';
import { SocketCard } from '../components/SocketCard';
import { FloatingNavBar } from '../components/FloatingNavBar';

export const HomeScreen: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    selectedRoomFilter,
    setSelectedRoomFilter,
    sockets,
    energyOverview,
    toggleSocket,
    setEditingSocket,
    setIsAddModalVisible,
  } = useSocketContext();

  const roomPills = ['Bedroom', 'Living Room', 'Kitchen'];

  const filteredSockets = sockets.filter((sock) => {
    if (selectedRoomFilter === 'All') return true;
    if (selectedRoomFilter === 'Living Room') {
      return sock.room.toLowerCase() === 'living room' || sock.room.toLowerCase() === 'sitting room';
    }
    return sock.room.toLowerCase() === selectedRoomFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Top Blue Header */}
      <View style={styles.blueHeader}>
        <View style={styles.headerBar}>
          <Text style={styles.greetingText}>Hello, Emma</Text>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => setIsAddModalVisible(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Energy Card placed in header overlapping the bottom boundary */}
        <View style={styles.energyCardWrapper}>
          <EnergyCard
            activeSockets={energyOverview.activeSockets}
            todayKw={energyOverview.todayKw}
          />
        </View>
      </View>

      {/* Main Dark Body */}
      <View style={styles.darkBody}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Room Filter Pills */}
          <View style={styles.pillsRow}>
            {roomPills.map((room) => {
              const isSelected = selectedRoomFilter.toLowerCase() === room.toLowerCase();
              return (
                <TouchableOpacity
                  key={room}
                  style={[styles.pill, isSelected && styles.activePill]}
                  onPress={() => setSelectedRoomFilter(room)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.activePillText,
                    ]}
                  >
                    {room}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sockets Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Sockets({filteredSockets.length || sockets.length})
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentScreen('addSocket')}
              activeOpacity={0.7}
              style={styles.sectionPlusButton}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {/* 2x2 Grid of Sockets */}
          <View style={styles.socketsGrid}>
            {(filteredSockets.length > 0 ? filteredSockets : sockets).map((sock) => (
              <SocketCard
                key={sock.id}
                socket={sock}
                onToggle={toggleSocket}
                onEdit={(item) => {
                  setEditingSocket(item);
                  setCurrentScreen('editSocket');
                }}
              />
            ))}
          </View>

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
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 32,
    marginBottom: 20,
  },
  greetingText: {
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
  energyCardWrapper: {
    marginBottom: -56,
  },
  darkBody: {
    flex: 1,
    backgroundColor: '#11141C',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 74,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pill: {
    backgroundColor: '#181C26',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  activePill: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  pillText: {
    color: '#8E9AA8',
    fontSize: 13,
    fontWeight: '600',
  },
  activePillText: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionPlusButton: {
    padding: 4,
  },
  socketsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
