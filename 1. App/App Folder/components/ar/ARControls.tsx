// SAARTHI — Minimal AR User Interface Controls
// Clean, unobtrusive overlay controls for model manipulation, camera toggle, and exit

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';

interface ARControlsProps {
  title: string;
  location: string;
  isARMode: boolean;
  scalePercent: number;
  onExit: () => void;
  onRecenter: () => void;
  onScaleChange: (delta: number) => void;
  onResetScale: () => void;
  onToggleMode?: () => void;
  onLaunchSceneViewer?: () => void;
}

export const ARControls: React.FC<ARControlsProps> = ({
  title,
  location,
  isARMode,
  scalePercent,
  onExit,
  onRecenter,
  onScaleChange,
  onResetScale,
  onToggleMode,
  onLaunchSceneViewer,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Header Floating Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onExit}
          accessibilityRole="button"
          accessibilityLabel="Exit AR Experience"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.titleCard}>
          <View style={styles.arBadge}>
            <Ionicons name="cube" size={11} color="#F59E0B" />
            <Text style={styles.arBadgeText}>{isARMode ? 'AR LIVE' : '3D VIEW'}</Text>
          </View>
          <Text style={styles.monumentTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.monumentLocation} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onRecenter}
          accessibilityRole="button"
          accessibilityLabel="Recenter Model"
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Minimal HUD Controls */}
      <View style={styles.bottomBar}>
        {/* Scale Controls Pill */}
        <View style={styles.scaleBar}>
          <TouchableOpacity
            style={styles.scaleBtn}
            onPress={() => onScaleChange(-0.15)}
            accessibilityRole="button"
            accessibilityLabel="Decrease model scale"
          >
            <Ionicons name="remove" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scaleReadoutBtn}
            onPress={onResetScale}
            accessibilityRole="button"
            accessibilityLabel={`Reset scale. Current is ${scalePercent}%`}
          >
            <Text style={styles.scaleText}>{scalePercent}%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scaleBtn}
            onPress={() => onScaleChange(0.15)}
            accessibilityRole="button"
            accessibilityLabel="Increase model scale"
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Mode Toggle Button (if available) */}
        {onToggleMode && (
          <TouchableOpacity
            style={styles.modeToggleBtn}
            onPress={onToggleMode}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Switch to ${isARMode ? '3D Studio' : 'AR Camera'}`}
          >
            <Ionicons
              name={isARMode ? 'cube-outline' : 'camera-outline'}
              size={15}
              color="#F59E0B"
            />
            <Text style={styles.modeToggleText}>
              {isARMode ? '3D Studio' : 'AR Camera'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Android ARCore Scene Viewer Button (if supported) */}
        {onLaunchSceneViewer && (
          <TouchableOpacity
            style={styles.arCoreBtn}
            onPress={onLaunchSceneViewer}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Launch native ARCore Scene Viewer"
          >
            <Ionicons name="scan" size={15} color="#10B981" />
            <Text style={styles.arCoreText}>ARCore</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Gentle Gesture Hint at bottom center */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>
          • Drag 1-finger to rotate • Pinch to scale • 2-finger to move •
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    zIndex: 20,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    paddingBottom: 20,
    pointerEvents: 'box-none' as const,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  titleCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    maxWidth: '65%',
  },
  arBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  arBadgeText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  monumentTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Typography.fonts.serifSemiBold,
  },
  monumentLocation: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
    fontFamily: Typography.fonts.sans,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 18,
  },
  scaleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: BorderRadius.round,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  scaleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleReadoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scaleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Typography.fonts.sans,
  },
  modeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  modeToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  arCoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.45)',
  },
  arCoreText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none' as const,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
