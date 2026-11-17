import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EnergyCardProps {
  activeSockets: number;
  todayKw: string;
}

export const EnergyCard: React.FC<EnergyCardProps> = ({ activeSockets, todayKw }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Energy Usage</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Active sockets</Text>
          <Text style={styles.activeNumber}>{activeSockets}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Today</Text>
          <View style={styles.kwRow}>
            <Text style={styles.kwNumber}>{todayKw}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#181C26',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#8E9AA8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  activeNumber: {
    color: '#22C55E',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  kwRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  kwNumber: {
    color: '#3B82F6',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  divider: {
    width: 1,
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
