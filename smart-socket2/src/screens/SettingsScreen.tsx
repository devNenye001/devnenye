import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { User, Volume2, Shield, Cpu, Bell, LogOut } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';
import { FloatingNavBar } from '../components/FloatingNavBar';

export const SettingsScreen: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    aiSafetyState,
    setVoiceAlertsEnabled,
  } = useSocketContext();

  return (
    <View style={styles.container}>
      {/* Top Blue Header */}
      <View style={styles.blueHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <View style={styles.darkBody}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <User size={26} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Emma</Text>
              <Text style={styles.profileEmail}>Emma@gmail.com</Text>
            </View>
          </View>

          {/* AI & Safety Preferences */}
          <Text style={styles.sectionTitle}>AI Safety & Voice Alerts</Text>
          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconCol}>
                <Volume2 size={18} color="#3B82F6" />
              </View>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>Spoken Voice Alerts</Text>
                <Text style={styles.settingDesc}>
                  Announce emergency trips and forgotten devices aloud
                </Text>
              </View>
              <Switch
                value={aiSafetyState.voiceAlertsEnabled}
                onValueChange={setVoiceAlertsEnabled}
                trackColor={{ false: '#334155', true: '#2563EB' }}
                thumbColor={aiSafetyState.voiceAlertsEnabled ? '#FFFFFF' : '#94A3B8'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingIconCol}>
                <Shield size={18} color="#22C55E" />
              </View>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>Auto-Cutoff on Hazard</Text>
                <Text style={styles.settingDesc}>
                  Automatically open relay when overcurrent is detected
                </Text>
              </View>
              <Switch
                value={true}
                disabled
                trackColor={{ false: '#334155', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Hardware Stack Reference (from docx) */}
          <Text style={styles.sectionTitle}>Hardware Architecture (Docx)</Text>
          <View style={styles.hardwareCard}>
            <View style={styles.hardwareItem}>
              <Cpu size={16} color="#3B82F6" style={{ marginRight: 10 }} />
              <Text style={styles.hardwareText}>
                ESP32 Wi-Fi Microcontroller (Dual-Core)
              </Text>
            </View>
            <View style={styles.hardwareItem}>
              <Cpu size={16} color="#3B82F6" style={{ marginRight: 10 }} />
              <Text style={styles.hardwareText}>
                PZEM-004T v3.0 Energy Monitoring Module
              </Text>
            </View>
            <View style={styles.hardwareItem}>
              <Cpu size={16} color="#3B82F6" style={{ marginRight: 10 }} />
              <Text style={styles.hardwareText}>
                5V Relay Module (Optocoupler-Isolated)
              </Text>
            </View>
            <View style={styles.hardwareItem}>
              <Cpu size={16} color="#3B82F6" style={{ marginRight: 10 }} />
              <Text style={styles.hardwareText}>
                HLK-PM01 AC-DC 5V Power Module
              </Text>
            </View>
            <View style={styles.hardwareItem}>
              <Cpu size={16} color="#3B82F6" style={{ marginRight: 10 }} />
              <Text style={styles.hardwareText}>
                Fuse and MOV (Metal Oxide Varistor) Protection
              </Text>
            </View>
          </View>

          {/* Log Out */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setCurrentScreen('login')}
            activeOpacity={0.8}
          >
            <LogOut size={16} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </ScrollView>
      </View>

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
  blueHeader: {
    backgroundColor: '#3B82F6',
    paddingTop: 54,
    paddingBottom: 28,
    paddingHorizontal: 22,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  darkBody: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#161B26',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#232A3B',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    color: '#94A3B8',
    fontSize: 13,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: '#161B26',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#232A3B',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIconCol: {
    width: 32,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDesc: {
    color: '#64748B',
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E2533',
  },
  hardwareCard: {
    backgroundColor: '#161B26',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#232A3B',
    marginBottom: 24,
  },
  hardwareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  hardwareText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#1E2533',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
});

