// SAARTHI — AR Plane & Surface Detection Overlay
// Minimal scanning UI per requirements: "Move your phone slowly to detect a surface" with subtle scanning indicator

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';

interface PlaneDetectionProps {
  status: 'detecting' | 'detected' | 'placed';
  onSurfaceFound?: () => void;
}

export const PlaneDetection: React.FC<PlaneDetectionProps> = ({ status }) => {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isNative = Platform.OS !== 'web';
    // Subtle breathing pulse animation for the scanning reticle
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: isNative,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: isNative,
        }),
      ])
    );

    // Continuous smooth rotation for the reticle ticks
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: isNative,
      })
    );

    pulseLoop.start();
    rotateLoop.start();

    return () => {
      pulseLoop.stop();
      rotateLoop.stop();
    };
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (status === 'placed') {
    return null;
  }

  const isDetected = status === 'detected';

  return (
    <View style={styles.container}>
      {/* Central AR Surface Reticle */}
      <View style={styles.reticleWrapper}>
        <Animated.View
          style={[
            styles.reticleOuter,
            isDetected && styles.reticleOuterDetected,
            { transform: [{ scale: pulseAnim }, { rotate: spin }] },
          ]}
        >
          <View style={styles.reticleCornerTL} />
          <View style={styles.reticleCornerTR} />
          <View style={styles.reticleCornerBL} />
          <View style={styles.reticleCornerBR} />
        </Animated.View>

        <View style={[styles.reticleCenterDot, isDetected && styles.reticleCenterDotDetected]} />
      </View>

      {/* Minimal Scanning Guidance Card */}
      <View style={styles.guidancePill}>
        <View style={[styles.statusIconCircle, isDetected && styles.statusIconCircleDetected]}>
          <Ionicons
            name={isDetected ? 'checkmark-circle' : 'scan-outline'}
            size={16}
            color={isDetected ? '#10B981' : '#F59E0B'}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.guidanceHeading}>
            {isDetected ? 'Flat Surface Detected' : 'Move phone slowly to detect surface'}
          </Text>
          <Text style={styles.guidanceSubtext}>
            {isDetected
              ? 'Placing India Gate model on surface...'
              : 'Point camera at floor, table or pavement'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
    pointerEvents: 'none' as const,
  },
  reticleWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.65)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  reticleOuterDetected: {
    borderColor: 'rgba(16, 185, 129, 0.85)',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  reticleCenterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
    position: 'absolute',
  },
  reticleCenterDotDetected: {
    backgroundColor: '#10B981',
    transform: [{ scale: 1.4 }],
  },
  reticleCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#F59E0B',
  },
  reticleCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#F59E0B',
  },
  reticleCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#F59E0B',
  },
  reticleCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#F59E0B',
  },
  guidancePill: {
    position: 'absolute',
    bottom: 110,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    maxWidth: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  statusIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statusIconCircleDetected: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
  },
  textContainer: {
    flexShrink: 1,
  },
  guidanceHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Typography.fonts.sans,
  },
  guidanceSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
    fontFamily: Typography.fonts.sans,
  },
});
