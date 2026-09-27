import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeritageScene, ExperienceHotspot } from '../../types/experience';
import { resolveImageSource } from '../../utils/image';

interface ImmersiveCanvasProps {
  scene: HeritageScene;
  onSelectHotspot: (hotspot: ExperienceHotspot) => void;
  selectedHotspotId?: string | null;
}

export interface ImmersiveCanvasRef {
  resetCenter: () => void;
  panTo: (xPercent: number, yPercent: number) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Canvas dimensions for 360-style pan
const CANVAS_WIDTH = SCREEN_WIDTH * 2.4;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 1.35;
const MAX_PAN_X = (CANVAS_WIDTH - SCREEN_WIDTH) / 2;
const MAX_PAN_Y = (CANVAS_HEIGHT - SCREEN_HEIGHT) / 2;

export const ImmersiveCanvas = forwardRef<ImmersiveCanvasRef, ImmersiveCanvasProps>(
  ({ scene, onSelectHotspot, selectedHotspotId }, ref) => {
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const currentOffset = useRef({ x: 0, y: 0 });

    // Track pan gesture
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => {
          // Allow tap on hotspots without triggering pan responder prematurely
          return Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4;
        },
        onPanResponderGrant: () => {
          pan.setOffset({
            x: currentOffset.current.x,
            y: currentOffset.current.y,
          });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_, gesture) => {
          let nextX = currentOffset.current.x + gesture.dx;
          let nextY = currentOffset.current.y + gesture.dy;

          // Clamp within boundaries with soft resistance
          if (Math.abs(nextX) > MAX_PAN_X) {
            gesture.dx = Math.sign(gesture.dx) * (MAX_PAN_X - Math.abs(currentOffset.current.x)) * 0.5;
          }
          if (Math.abs(nextY) > MAX_PAN_Y) {
            gesture.dy = Math.sign(gesture.dy) * (MAX_PAN_Y - Math.abs(currentOffset.current.y)) * 0.5;
          }

          pan.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
          let finalX = currentOffset.current.x + gesture.dx;
          let finalY = currentOffset.current.y + gesture.dy;

          // Hard clamp
          finalX = Math.max(-MAX_PAN_X, Math.min(MAX_PAN_X, finalX));
          finalY = Math.max(-MAX_PAN_Y, Math.min(MAX_PAN_Y, finalY));

          currentOffset.current = { x: finalX, y: finalY };
          pan.flattenOffset();

          Animated.spring(pan, {
            toValue: { x: finalX, y: finalY },
            useNativeDriver: false,
            friction: 7,
            tension: 50,
          }).start();
        },
      })
    ).current;

    useImperativeHandle(ref, () => ({
      resetCenter: () => {
        currentOffset.current = { x: 0, y: 0 };
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 6,
          tension: 40,
        }).start();
      },
      panTo: (xPercent: number, yPercent: number) => {
        // Map 0-100% to offset
        const targetX = -( (xPercent / 100) * CANVAS_WIDTH - CANVAS_WIDTH / 2 );
        const targetY = -( (yPercent / 100) * CANVAS_HEIGHT - CANVAS_HEIGHT / 2 );
        const clampedX = Math.max(-MAX_PAN_X, Math.min(MAX_PAN_X, targetX));
        const clampedY = Math.max(-MAX_PAN_Y, Math.min(MAX_PAN_Y, targetY));

        currentOffset.current = { x: clampedX, y: clampedY };
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: clampedX, y: clampedY },
          useNativeDriver: false,
          friction: 6,
          tension: 40,
        }).start();
      },
    }));

    return (
      <View style={styles.container} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.canvas,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}
        >
          {/* Panoramic / Monument Backdrop */}
          <Image
            source={resolveImageSource(scene.imageUrl)}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          {/* Vignette Gradients */}
          <View style={styles.topVignette} />
          <View style={styles.bottomVignette} />

          {/* Interactive Architectural Hotspots */}
          {scene.hotspots.map((hotspot) => {
            const isSelected = selectedHotspotId === hotspot.id;
            const leftPos = (hotspot.position.x / 100) * CANVAS_WIDTH - 24;
            const topPos = (hotspot.position.y / 100) * CANVAS_HEIGHT - 24;

            return (
              <TouchableOpacity
                key={hotspot.id}
                style={[
                  styles.hotspotMarker,
                  { left: leftPos, top: topPos },
                  isSelected && styles.hotspotMarkerActive,
                ]}
                activeOpacity={0.85}
                onPress={() => onSelectHotspot(hotspot)}
              >
                {/* Outer Glow Ring */}
                <View style={[styles.outerGlow, isSelected && styles.outerGlowActive]} />
                
                {/* Core Pin */}
                <View style={[styles.corePin, isSelected && styles.corePinActive]}>
                  <Ionicons
                    name={getHotspotIcon(hotspot.category)}
                    size={14}
                    color={isSelected ? '#1A1815' : '#FFFFFF'}
                  />
                </View>

                {/* Hotspot Title Pill if selected */}
                {isSelected && (
                  <View style={styles.hotspotBadge}>
                    <Text style={styles.hotspotBadgeText} numberOfLines={1}>
                      {hotspot.title}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>
    );
  }
);

function getHotspotIcon(category: string): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case 'Architecture':
      return 'business-outline';
    case 'Sculpture':
      return 'color-wand-outline';
    case 'History':
      return 'hourglass-outline';
    case 'Spiritual':
      return 'flower-outline';
    case 'Relic':
      return 'shield-checkmark-outline';
    case 'Inscription':
      return 'document-text-outline';
    default:
      return 'sparkles-outline';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0D0B',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    position: 'absolute',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(10,9,8,0.45)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(10,9,8,0.6)',
  },
  hotspotMarker: {
    position: 'absolute',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  hotspotMarkerActive: {
    zIndex: 20,
  },
  outerGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(217, 119, 6, 0.28)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.65)',
  },
  outerGlowActive: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(217, 119, 6, 0.45)',
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  corePin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(26, 24, 21, 0.92)',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  corePinActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#1A1815',
  },
  hotspotBadge: {
    position: 'absolute',
    bottom: -22,
    backgroundColor: '#1E1B18',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D97706',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 5,
    maxWidth: 160,
  },
  hotspotBadgeText: {
    color: '#FFFDF9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
