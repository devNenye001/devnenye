import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { ChevronLeft, Plus, Edit2, Trash2 } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';
import { EnergyCard } from '../components/EnergyCard';
import { FloatingNavBar } from '../components/FloatingNavBar';

export const RoomDetailScreen: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    selectedRoom,
    sockets,
    toggleSocket,
    deleteSocket,
    setEditingSocket,
  } = useSocketContext();

  const [activeSwipeId, setActiveSwipeId] = useState<string | null>('s3'); // default Socket 3 swiped like screenshot

  const roomName = selectedRoom ? selectedRoom.name : 'Bedroom';
  const roomImage = selectedRoom?.imageUrl || 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80';

  const roomSockets = sockets.filter((s) => s.room.toLowerCase() === roomName.toLowerCase());
  const displaySockets = roomSockets.length > 0 ? roomSockets : sockets;

  return (
    <View style={styles.container}>
      {/* Top Room Banner Image */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: roomImage }} style={styles.bannerImage} />
        <View style={styles.darkGradientOverlay} />

        {/* Top Navigation Row */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('rooms')}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{roomName}</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Energy Usage Card (matching 4 active sockets, 48,2Kw) */}
          <EnergyCard activeSockets={4} todayKw="48,2Kw" />

          {/* Sockets Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Sockets({displaySockets.length})
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentScreen('addSocket')}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#F8FAFC" />
            </TouchableOpacity>
          </View>

          {/* List of Sockets (supporting swipe actions) */}
          {displaySockets.map((sock) => {
            const isSwiped = activeSwipeId === sock.id;

            return (
              <View key={sock.id} style={styles.socketRowContainer}>
                {/* Main Card */}
                <TouchableOpacity
                  style={[styles.socketRowCard, isSwiped && styles.socketRowCardSwiped]}
                  activeOpacity={0.9}
                  onPress={() => setActiveSwipeId(isSwiped ? null : sock.id)}
                >
                  <Text style={styles.socketRowName}>{sock.name}</Text>
                  <Switch
                    value={sock.isOn}
                    onValueChange={() => toggleSocket(sock.id)}
                    trackColor={{ false: '#334155', true: '#2563EB' }}
                    thumbColor={sock.isOn ? '#FFFFFF' : '#94A3B8'}
                  />
                </TouchableOpacity>

                {/* Swiped Action Buttons (Edit & Delete) */}
                {isSwiped && (
                  <View style={styles.swipeActionsContainer}>
                    <TouchableOpacity
                      style={styles.swipeEditButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        setEditingSocket(sock);
                        setCurrentScreen('editSocket');
                      }}
                    >
                      <Edit2 size={16} color="#FFFFFF" />
                      <Text style={styles.swipeButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.swipeDeleteButton}
                      activeOpacity={0.8}
                      onPress={() => deleteSocket(sock.id)}
                    >
                      <Trash2 size={16} color="#FFFFFF" />
                      <Text style={styles.swipeButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          <View style={{ height: 100 }} />
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
    backgroundColor: '#0F172A',
  },
  bannerContainer: {
    height: 190,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  darkGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 15, 23, 0.55)',
  },
  topNavRow: {
    paddingTop: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
  },
  navTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  socketRowContainer: {
    marginBottom: 14,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  socketRowCard: {
    flex: 1,
    backgroundColor: '#161B26',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#232A3B',
  },
  socketRowCardSwiped: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    flex: 0.62,
  },
  socketRowName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  swipeActionsContainer: {
    flexDirection: 'row',
    flex: 0.38,
    height: '100%',
  },
  swipeEditButton: {
    flex: 1,
    backgroundColor: '#D97706', // Warm orange from screenshot
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  swipeDeleteButton: {
    flex: 1,
    backgroundColor: '#DC2626', // Red from screenshot
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  swipeButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});

