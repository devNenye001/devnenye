import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { SocketProvider, useSocketContext } from './src/context/SocketContext';
import { AddNewModal } from './src/components/AddNewModal';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoomsScreen } from './src/screens/RoomsScreen';
import { RoomDetailScreen } from './src/screens/RoomDetailScreen';
import { AddSocketScreen } from './src/screens/AddSocketScreen';
import { AddRoomScreen } from './src/screens/AddRoomScreen';
import { EditSocketScreen } from './src/screens/EditSocketScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const ScreenRouter: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    isAddModalVisible,
    setIsAddModalVisible,
  } = useSocketContext();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'home':
        return <HomeScreen />;
      case 'rooms':
        return <RoomsScreen />;
      case 'roomDetail':
        return <RoomDetailScreen />;
      case 'addSocket':
        return <AddSocketScreen />;
      case 'addRoom':
        return <AddRoomScreen />;
      case 'editSocket':
        return <EditSocketScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isBlueHeader = [
    'home',
    'rooms',
    'analytics',
    'settings',
    'roomDetail',
    'addSocket',
    'addRoom',
    'editSocket',
  ].includes(currentScreen);
  const statusBarColor = isBlueHeader ? '#3B82F6' : '#090E17';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: statusBarColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={statusBarColor} />
      <View style={styles.screenContainer}>
        {renderActiveScreen()}

        {/* Global Add New Sheet Modal (matching Frame 65) */}
        <AddNewModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onSelectSocket={() => setCurrentScreen('addSocket')}
          onSelectRoom={() => setCurrentScreen('addRoom')}
        />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SocketProvider>
      <ScreenRouter />
    </SocketProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090E17',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#090E17',
  },
});
