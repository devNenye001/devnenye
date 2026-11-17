import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { ChevronLeft, Check, Image as ImageIcon, ChevronDown } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';

type AddStep = 'searching' | 'select' | 'configure' | 'success';

const SocketDeviceGraphic: React.FC<{ size?: number }> = ({ size = 68 }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Outer rounded socket body */}
    <Rect
      x="5"
      y="8"
      width="54"
      height="48"
      rx="12"
      stroke="#2563EB"
      strokeWidth="1.6"
      opacity={0.85}
    />
    {/* Left vertical dividing seam */}
    <Path
      d="M21 8 V56"
      stroke="#2563EB"
      strokeWidth="1.6"
      opacity={0.85}
    />
    {/* Left side notch */}
    <Path
      d="M5 32 H21"
      stroke="#2563EB"
      strokeWidth="1.6"
      opacity={0.85}
    />
    {/* Radio / Wi-Fi waves on the right */}
    <Path
      d="M33 40 C37 35, 43 35, 47 40"
      stroke="#2563EB"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity={0.9}
    />
    <Path
      d="M29 33 C35 25, 45 25, 51 33"
      stroke="#2563EB"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity={0.9}
    />
  </Svg>
);

export const AddSocketScreen: React.FC = () => {
  const { setCurrentScreen, addNewSocket, rooms } = useSocketContext();

  const [step, setStep] = useState<AddStep>('searching');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [socketName, setSocketName] = useState('Socket MXH-76809');
  const [selectedRoomName, setSelectedRoomName] = useState('Kitchen');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Auto transition from searching to select step after 2.2 seconds
  useEffect(() => {
    if (step === 'searching') {
      const timer = setTimeout(() => {
        setStep('select');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSelectDevice = (device: string) => {
    setSelectedDevice(device);
    setSocketName(device);
  };

  const handleConnect = () => {
    if (!selectedDevice) return;
    setStep('configure');
  };

  const handleDoneConfiguring = () => {
    addNewSocket({
      name: socketName.trim() || selectedDevice || 'Smart Socket',
      room: selectedRoomName,
    });
    setStep('success');
  };

  // STEP 4: SUCCESS SCREEN (iPhone 16 - 21)
  if (step === 'success') {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#11141C" />

        <View style={styles.successContent}>
          {/* Circular green checkmark badge */}
          <View style={styles.successHalo}>
            <View style={styles.successInnerCircle}>
              <Check size={52} color="#FFFFFF" strokeWidth={3.5} />
            </View>
          </View>

          <Text style={styles.successMessage}>
            Congratulations!! you have{'\n'}successfully added a new{'\n'}socket.
          </Text>
        </View>

        {/* Bottom Proceed Button */}
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={() => setCurrentScreen('home')}
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
            onPress={() => {
              if (step === 'configure') {
                setStep('select');
              } else if (step === 'select') {
                setStep('searching');
              } else {
                setCurrentScreen('home');
              }
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {step === 'configure' ? 'Add Room' : 'Add Socket'}
          </Text>

          {step === 'configure' ? (
            <TouchableOpacity
              onPress={handleDoneConfiguring}
              activeOpacity={0.7}
              style={[styles.headerNavButton, { alignItems: 'flex-end' }]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerNavButton} />
          )}
        </View>
      </View>

      {/* Main Dark Body */}
      <View style={styles.darkBody}>
        {/* STEP 1: SEARCHING (iPhone 16 - 10) */}
        {step === 'searching' && (
          <View style={styles.searchingContainer}>
            <View style={styles.deviceGraphicWrapper}>
              <SocketDeviceGraphic size={76} />
            </View>

            <Text style={styles.searchingText}>Searching for a new socket.....</Text>

            <ActivityIndicator
              size="small"
              color="#8E9AA8"
              style={styles.spinner}
            />

            <TouchableOpacity
              onPress={() => setCurrentScreen('home')}
              activeOpacity={0.7}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: SELECT DEVICE (iPhone 16 - 11 & iPhone 16 - 12) */}
        {step === 'select' && (
          <View style={styles.selectContainer}>
            <View style={styles.deviceGraphicWrapper}>
              <SocketDeviceGraphic size={72} />
            </View>

            <Text style={styles.selectLabel}>Select socket</Text>

            {/* Discovered Sockets List Card */}
            <View style={styles.deviceListCard}>
              <TouchableOpacity
                style={styles.deviceRow}
                onPress={() => handleSelectDevice('Socket MXH-76809')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.deviceName,
                    selectedDevice === 'Socket MXH-76809' && styles.deviceNameSelected,
                  ]}
                >
                  Socket MXH-76809
                </Text>
                {selectedDevice === 'Socket MXH-76809' && (
                  <Check size={18} color="#FFFFFF" strokeWidth={2.4} />
                )}
              </TouchableOpacity>

              <View style={styles.deviceDivider} />

              <TouchableOpacity
                style={styles.deviceRow}
                onPress={() => handleSelectDevice('Socket MXH-45236')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.deviceName,
                    selectedDevice === 'Socket MXH-45236' && styles.deviceNameSelected,
                  ]}
                >
                  Socket MXH-45236
                </Text>
                {selectedDevice === 'Socket MXH-45236' && (
                  <Check size={18} color="#FFFFFF" strokeWidth={2.4} />
                )}
              </TouchableOpacity>
            </View>

            {/* Connect Action Button */}
            <TouchableOpacity
              style={[
                styles.connectButton,
                selectedDevice ? styles.connectButtonActive : styles.connectButtonDisabled,
              ]}
              onPress={handleConnect}
              disabled={!selectedDevice}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.connectButtonText,
                  selectedDevice ? styles.connectButtonTextActive : styles.connectButtonTextDisabled,
                ]}
              >
                Connect
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: CONFIGURE SOCKET / ADD ROOM (iPhone 16 - 13) */}
        {step === 'configure' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.configureScroll}
          >
            {/* Add Picture Box */}
            <TouchableOpacity style={styles.pictureContainer} activeOpacity={0.8}>
              <ImageIcon size={38} color="#3B82F6" strokeWidth={1.5} />
              <Text style={styles.addPictureText}>Add picture</Text>
            </TouchableOpacity>

            {/* Enter socket name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter socket name</Text>
              <TextInput
                style={styles.textInput}
                value={socketName}
                onChangeText={setSocketName}
                placeholder="Enter socket name"
                placeholderTextColor="#64748B"
              />
            </View>

            {/* Enter room name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter room name</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue}>{selectedRoomName}</Text>
                <ChevronDown size={18} color="#8E9AA8" />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {rooms.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedRoomName(r.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{r.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        )}
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
  // Step 1: Searching
  searchingContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  deviceGraphicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  searchingText: {
    color: '#8E9AA8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 24,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
  },
  // Step 2: Select Device
  selectContainer: {
    flex: 1,
  },
  selectLabel: {
    color: '#8E9AA8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
    paddingLeft: 4,
  },
  deviceListCard: {
    backgroundColor: '#181C26',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 32,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  deviceName: {
    color: '#8E9AA8',
    fontSize: 15,
    fontWeight: '500',
  },
  deviceNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  deviceDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: 18,
  },
  connectButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonActive: {
    backgroundColor: '#3B82F6',
  },
  connectButtonDisabled: {
    backgroundColor: '#161B26',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  connectButtonTextActive: {
    color: '#FFFFFF',
  },
  connectButtonTextDisabled: {
    color: '#475569',
  },
  // Step 3: Configure / Add Room
  configureScroll: {
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
  dropdownInput: {
    backgroundColor: '#181C26',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: '#181C26',
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  // Step 4: Success Screen
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
