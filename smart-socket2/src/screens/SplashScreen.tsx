import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { Zap } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useSocketContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    // Smooth logo reveal animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance to onboarding after splash display
    const timer = setTimeout(() => {
      setCurrentScreen('onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, setCurrentScreen]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={() => setCurrentScreen('onboarding')}
    >
      <StatusBar barStyle="light-content" backgroundColor="#090E17" />
      <Animated.View
        style={[
          styles.brandRow,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Zap size={38} color="#FF6A00" fill="#FF6A00" strokeWidth={1} />
        </View>
        <Text style={styles.brandText}>VoltPass</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090E17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
});
