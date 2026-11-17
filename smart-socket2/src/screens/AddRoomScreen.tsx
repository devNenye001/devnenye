import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { ChevronLeft, Image as ImageIcon, Check } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';

export const AddRoomScreen: React.FC = () => {
  const { setCurrentScreen, addNewRoom } = useSocketContext();
  const [roomName, setRoomName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDone = () => {
    if (roomName.trim()) {
      addNewRoom(roomName.trim());
      setIsSuccess(true);
    } else {
      setCurrentScreen('rooms');
    }
  };

  // SUCCESS SCREEN (iPhone 16 - 21)
  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#11141C" />

        <View style={styles.successContent}>
          <View style={styles.successHalo}>
            <View style={styles.successInnerCircle}>
              <Check size={52} color="#FFFFFF" strokeWidth={3.5} />
            </View>
          </View>

          <Text style={styles.successMessage}>
            Congratulations!! you have{'\n'}successfully added a new{'\n'}room.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.proceedButton}
          onPress={() => setCurrentScreen('rooms')}
          activeOpacity={0.85}
        >
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Top Blue Header */}
      <View style={styles.blueHeader}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.headerNavButton}
            onPress={() => setCurrentScreen('rooms')}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Room</Text>

          <TouchableOpacity
            onPress={handleDone}
            activeOpacity={0.7}
            style={[styles.headerNavButton, { alignItems: 'flex-end' }]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Dark Body */}
      <View style={styles.darkBody}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Add Picture Box */}
          <TouchableOpacity style={styles.pictureContainer} activeOpacity={0.8}>
            <ImageIcon size={38} color="#3B82F6" strokeWidth={1.5} />
            <Text style={styles.addPictureText}>Add picture</Text>
          </TouchableOpacity>

          {/* Enter Room Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Enter room name</Text>
            <TextInput
              style={styles.textInput}
              value={roomName}
              onChangeText={setRoomName}
              placeholder="Enter room name"
              placeholderTextColor="#64748B"
            />
          </View>
        </ScrollView>
      </View>
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
    justifyContent: 'space-between',
    height: 40,
  },
  headerNavButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  darkBody: {
    flex: 1,
    backgroundColor: '#11141C',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -16,
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pictureContainer: {
    height: 150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    backgroundColor: 'rgba(24, 28, 38, 0.4)',
  },
  addPictureText: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#8E9AA8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    paddingLeft: 4,
  },
  textInput: {
    backgroundColor: '#181C26',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  // Success Screen
  successContainer: {
    flex: 1,
    backgroundColor: '#11141C',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 140,
    paddingBottom: 40,
  },
  successContent: {
    alignItems: 'center',
  },
  successHalo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(34, 197, 94, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successInnerCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successMessage: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 25,
    letterSpacing: -0.2,
  },
  proceedButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
