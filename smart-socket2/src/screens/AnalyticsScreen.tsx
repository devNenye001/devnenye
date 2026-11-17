import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Activity, ShieldAlert, Cpu, AlertTriangle, Zap, Volume2 } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';
import { FloatingNavBar } from '../components/FloatingNavBar';

export const AnalyticsScreen: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    sockets,
    aiSafetyState,
    triggerFaultSimulation,
    emergencyRelayCutoff,
  } = useSocketContext();

  const primarySocket = sockets[0] || {
    voltage: 230.0,
    current: 1.2,
    power: 270.0,
    energy: 14.8,
    frequency: 50.0,
    powerFactor: 0.98,
  };

  const isTrip = aiSafetyState.isRelayCutoff;
  const anomalyPercent = (aiSafetyState.anomalyScore * 100).toFixed(0);

  return (
    <View style={styles.container}>
      {/* Top Blue Header */}
      <View style={styles.blueHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Power Engine</Text>
          <View style={styles.badgePill}>
            <Cpu size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.badgeText}>TinyML Active</Text>
          </View>
        </View>
      </View>

      <View style={styles.darkBody}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* AI Anomaly Score Card */}
          <View
            style={[
              styles.aiStatusCard,
              isTrip && { borderColor: '#EF4444' },
            ]}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardTitleRow}>
                <ShieldAlert
                  size={20}
                  color={isTrip ? '#EF4444' : '#22C55E'}
                />
                <Text style={styles.cardTitle}>TinyML Safety Assessment</Text>
              </View>
              <Text
                style={[
                  styles.statusTag,
                  { color: isTrip ? '#EF4444' : '#22C55E' },
                ]}
              >
                {aiSafetyState.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreNumber}>{anomalyPercent}%</Text>
              <Text style={styles.scoreLabel}>Anomaly Risk Probability</Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(100, aiSafetyState.anomalyScore * 100)}%`,
                    backgroundColor: isTrip ? '#EF4444' : '#3B82F6',
                  },
                ]}
              />
            </View>

            {/* Spoken Voice Alert Notice */}
            <View style={styles.voiceAlertBox}>
              <Volume2 size={16} color="#60A5FA" style={{ marginRight: 8 }} />
              <Text style={styles.voiceAlertText}>
                {aiSafetyState.lastVoiceAlert}
              </Text>
            </View>
          </View>

          {/* PZEM-004T Live Telemetry Grid */}
          <Text style={styles.sectionHeader}>PZEM-004T Continuous Telemetry</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>AC Voltage</Text>
              <Text style={styles.metricValue}>{primarySocket.voltage.toFixed(1)} V</Text>
              <Text style={styles.metricSub}>Mains Grid</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Load Current</Text>
              <Text style={styles.metricValue}>{primarySocket.current.toFixed(2)} A</Text>
              <Text style={styles.metricSub}>RMS Value</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Active Power</Text>
              <Text style={styles.metricValue}>{primarySocket.power.toFixed(0)} W</Text>
              <Text style={styles.metricSub}>Real Load</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Energy Total</Text>
              <Text style={styles.metricValue}>{primarySocket.energy.toFixed(2)} kWh</Text>
              <Text style={styles.metricSub}>Accumulated</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Power Factor</Text>
              <Text style={styles.metricValue}>{primarySocket.powerFactor.toFixed(2)} PF</Text>
              <Text style={styles.metricSub}>Efficiency</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Frequency</Text>
              <Text style={styles.metricValue}>{primarySocket.frequency.toFixed(1)} Hz</Text>
              <Text style={styles.metricSub}>Stability</Text>
            </View>
          </View>

          {/* Fault Simulation Playground */}
          <Text style={styles.sectionHeader}>Hardware Fault & AI Test Injection</Text>
          <View style={styles.simulatorCard}>
            <Text style={styles.simulatorHint}>
              Simulate electrical conditions from the docx to test TinyML behavior:
            </Text>

            <View style={styles.simButtonsRow}>
              <TouchableOpacity
                style={styles.simButton}
                onPress={() => triggerFaultSimulation('normal')}
              >
                <Text style={styles.simButtonText}>Normal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.simButton}
                onPress={() => triggerFaultSimulation('vampire')}
              >
                <Text style={styles.simButtonText}>Vampire Drain</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.simButton, { borderColor: '#EF4444' }]}
                onPress={() => triggerFaultSimulation('overload')}
              >
                <Text style={[styles.simButtonText, { color: '#EF4444' }]}>
                  Overload 15A
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.simButton, { borderColor: '#F59E0B' }]}
                onPress={() => triggerFaultSimulation('surge')}
              >
                <Text style={[styles.simButtonText, { color: '#F59E0B' }]}>
                  Surge 258V
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Power Cutoff */}
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={emergencyRelayCutoff}
            activeOpacity={0.85}
          >
            <Zap size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.emergencyText}>EMERGENCY RELAY CUTOFF</Text>
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
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
  aiStatusCard: {
    backgroundColor: '#161B26',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#232A3B',
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  statusTag: {
    fontSize: 12,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreNumber: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
    marginRight: 10,
  },
  scoreLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#1E2533',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  voiceAlertBox: {
    backgroundColor: '#1E2533',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceAlertText: {
    color: '#94A3B8',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  sectionHeader: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '31%',
    backgroundColor: '#161B26',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#232A3B',
    marginBottom: 10,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricSub: {
    color: '#3B82F6',
    fontSize: 9,
    fontWeight: '600',
  },
  simulatorCard: {
    backgroundColor: '#161B26',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#232A3B',
    marginBottom: 20,
  },
  simulatorHint: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 14,
  },
  simButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  simButton: {
    backgroundColor: '#1E2533',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  simButtonText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
  emergencyButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

