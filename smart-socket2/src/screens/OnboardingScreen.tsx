import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { ChevronRight, Check } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRACK_HORIZONTAL_MARGIN = 24;
const TRACK_WIDTH = SCREEN_WIDTH - TRACK_HORIZONTAL_MARGIN * 2;
const KNOB_SIZE = 52;
const TRACK_PADDING = 6;
const MAX_SLIDE_DISTANCE = TRACK_WIDTH - KNOB_SIZE - TRACK_PADDING * 2;

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen } = useSocketContext();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const isNavigating = useRef(false);

  const navigateToLogin = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    setCurrentScreen('login');
  };

  const handleSlideSuccess = () => {
    Animated.timing(slideAnim, {
      toValue: MAX_SLIDE_DISTANCE,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      navigateToLogin();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 3,
      onPanResponderMove: (_, gestureState) => {
        if (isNavigating.current) return;
        const newX = Math.max(0, Math.min(gestureState.dx, MAX_SLIDE_DISTANCE));
        slideAnim.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isNavigating.current) return;
        // Either dragged far enough OR a tap on the knob
        if (gestureState.dx >= MAX_SLIDE_DISTANCE * 0.35 || Math.abs(gestureState.dx) < 6) {
          handleSlideSuccess();
        } else {
          // Snap back
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Text fades out smoothly as slider moves right
  const textOpacity = slideAnim.interpolate({
    inputRange: [0, MAX_SLIDE_DISTANCE * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Interior Background Image */}
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        }}
        style={styles.backgroundImage}
      />

      {/* Subtle Dark Vignette & Gradient Overlays */}
      <View style={styles.topVignette} />
      <View style={styles.bottomVignette} />

      <View style={styles.contentContainer}>
        {/* Headline matching iPhone 16 - 2 */}
        <View style={styles.headerWrapper}>
          <Text style={styles.headline}>
            Experience the{'\n'}Future of smart{'\n'}living.
          </Text>
        </View>

        {/* Interactive "Slide to get started" bar */}
        <View style={styles.sliderWrapper}>
          <TouchableWithoutFeedback onPress={handleSlideSuccess}>
            <View style={styles.track}>
              {/* Centered Guide Text */}
              <Animated.View style={[styles.textContainer, { opacity: textOpacity }]} pointerEvents="none">
                <Text style={styles.slidePromptText}>Slide to get started</Text>
              </Animated.View>

              {/* Right Destination Checkmark Circle */}
              <View style={styles.targetCircle} pointerEvents="none">
                <Check size={18} color="#CBD5E1" strokeWidth={2.4} />
              </View>

              {/* Draggable Blue Knob */}
              <Animated.View
                style={[
                  styles.knob,
                  {
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(8, 12, 20, 0.52)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(8, 12, 20, 0.45)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: TRACK_HORIZONTAL_MARGIN,
    paddingTop: 85,
    paddingBottom: 45,
  },
  headerWrapper: {
    marginTop: 10,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.6,
  },
  sliderWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(45, 60, 85, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    paddingHorizontal: TRACK_PADDING,
    position: 'relative',
    overflow: 'hidden',
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  slidePromptText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  targetCircle: {
    position: 'absolute',
    right: TRACK_PADDING + 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
    left: TRACK_PADDING,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
});
