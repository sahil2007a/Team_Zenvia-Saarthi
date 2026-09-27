// SAARTHI — 360° Virtual Tour Hotspot Marker Pin
// Visual interactive element projected onto the 360 scene with category icons and animated pulse

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VirtualTourHotspot, VirtualTourHotspotCategory } from '../../types/virtualTour';

interface VirtualTourHotspotPinProps {
  hotspot: VirtualTourHotspot;
  screenX: number;
  screenY: number;
  visible: boolean;
  isSelected: boolean;
  language: 'en' | 'hi';
  onPress: (hotspot: VirtualTourHotspot) => void;
}

const getCategoryIcon = (category: VirtualTourHotspotCategory): keyof typeof Ionicons.glyphMap => {
  switch (category) {
    case 'Architecture':
      return 'business-outline';
    case 'History':
      return 'time-outline';
    case 'Sculpture':
      return 'color-palette-outline';
    case 'Inscription':
      return 'document-text-outline';
    case 'Relic':
      return 'diamond-outline';
    case 'Complex':
      return 'map-outline';
    default:
      return 'sparkles-outline';
  }
};

const getCategoryColor = (category: VirtualTourHotspotCategory): string => {
  switch (category) {
    case 'Architecture':
      return '#F59E0B'; // Amber
    case 'History':
      return '#3B82F6'; // Blue
    case 'Inscription':
      return '#10B981'; // Emerald
    case 'Sculpture':
      return '#EC4899'; // Pink
    case 'Complex':
      return '#8B5CF6'; // Purple
    default:
      return '#F59E0B';
  }
};

export const VirtualTourHotspotPin: React.FC<VirtualTourHotspotPinProps> = ({
  hotspot,
  screenX,
  screenY,
  visible,
  isSelected,
  language,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0.4)).current;
  const rippleOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Gentle breathing and ripple animation for hotspots
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const rippleLoop = Animated.loop(
      Animated.parallel([
        Animated.timing(rippleAnim, {
          toValue: 2.2,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    pulseLoop.start();
    rippleLoop.start();

    return () => {
      pulseLoop.stop();
      rippleLoop.stop();
    };
  }, []);

  if (!visible) return null;

  const color = getCategoryColor(hotspot.category);
  const icon = getCategoryIcon(hotspot.category);
  const title = hotspot.title[language] || hotspot.title.en;

  return (
    <View
      style={[
        styles.container,
        {
          left: screenX,
          top: screenY,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        onPress={() => onPress(hotspot)}
        activeOpacity={0.8}
        style={styles.touchTarget}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${hotspot.category}`}
      >
        {/* Outer Ripple Effect */}
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: color,
              transform: [{ scale: rippleAnim }],
              opacity: rippleOpacity,
            },
          ]}
        />

        {/* Central Core Pin */}
        <Animated.View
          style={[
            styles.pinCore,
            {
              backgroundColor: isSelected ? '#FFFFFF' : 'rgba(15, 23, 42, 0.88)',
              borderColor: color,
              transform: [{ scale: isSelected ? 1.25 : pulseAnim }],
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={14}
            color={isSelected ? '#0F172A' : color}
          />
        </Animated.View>

        {/* Title Label Bubble */}
        <View
          style={[
            styles.labelBubble,
            isSelected && styles.labelBubbleSelected,
          ]}
        >
          <View style={[styles.categoryDot, { backgroundColor: color }]} />
          <Text style={styles.labelText} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  touchTarget: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  ripple: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
  },
  pinCore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 8,
  },
  labelBubble: {
    position: 'absolute',
    top: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 160,
  },
  labelBubbleSelected: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(30, 41, 59, 0.96)',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
