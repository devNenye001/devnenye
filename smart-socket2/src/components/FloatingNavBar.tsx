import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, LayoutGrid, BarChart2, Settings } from 'lucide-react-native';
import { ScreenType } from '../types';

interface FloatingNavBarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const isHome = currentScreen === 'home';
  const isRooms = currentScreen === 'rooms' || currentScreen === 'roomDetail';
  const isAnalytics = currentScreen === 'analytics';
  const isSettings = currentScreen === 'settings';

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.pillBar}>
        {/* Home Tab */}
        <TouchableOpacity
          onPress={() => onSelectScreen('home')}
          style={[styles.tabButton, isHome && styles.activeTabButton]}
          activeOpacity={0.8}
        >
          <Home
            size={isHome ? 22 : 20}
            color={isHome ? '#FFFFFF' : '#8E9AA8'}
            strokeWidth={isHome ? 2.5 : 2}
          />
        </TouchableOpacity>

        {/* Rooms / Grid Tab */}
        <TouchableOpacity
          onPress={() => onSelectScreen('rooms')}
          style={[styles.tabButton, isRooms && styles.activeTabButton]}
          activeOpacity={0.8}
        >
          <LayoutGrid
            size={isRooms ? 22 : 20}
            color={isRooms ? '#FFFFFF' : '#8E9AA8'}
            strokeWidth={isRooms ? 2.5 : 2}
          />
        </TouchableOpacity>

        {/* Analytics Tab */}
        <TouchableOpacity
          onPress={() => onSelectScreen('analytics')}
          style={[styles.tabButton, isAnalytics && styles.activeTabButton]}
          activeOpacity={0.8}
        >
          <BarChart2
            size={isAnalytics ? 22 : 20}
            color={isAnalytics ? '#FFFFFF' : '#8E9AA8'}
            strokeWidth={isAnalytics ? 2.5 : 2}
          />
        </TouchableOpacity>

        {/* Settings Tab */}
        <TouchableOpacity
          onPress={() => onSelectScreen('settings')}
          style={[styles.tabButton, isSettings && styles.activeTabButton]}
          activeOpacity={0.8}
        >
          <Settings
            size={isSettings ? 22 : 20}
            color={isSettings ? '#FFFFFF' : '#8E9AA8'}
            strokeWidth={isSettings ? 2.5 : 2}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#181C26',
    borderRadius: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: 260,
    height: 66,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  tabButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});
