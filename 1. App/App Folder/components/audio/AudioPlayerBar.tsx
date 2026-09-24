// SAARTHI Design System — Floating Audio Guide Player Bar
// Per PRD §14, §20 & TRD §16: Persistent audio guide controls across the app

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { useAudioStore } from '../../store/audioStore';

export const AudioPlayerBar: React.FC = () => {
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const playbackState = useAudioStore((s) => s.playbackState);
  const position = useAudioStore((s) => s.position);
  const speed = useAudioStore((s) => s.speed);
  const setSpeed = useAudioStore((s) => s.setSpeed);
  const pause = useAudioStore((s) => s.pause);
  const resume = useAudioStore((s) => s.resume);
  const stop = useAudioStore((s) => s.stop);

  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const [showSpeedModal, setShowSpeedModal] = useState(false);

  if (!currentTrack || playbackState === 'stopped') {
    return null;
  }

  const isPlaying = playbackState === 'playing';
  const progressPercent =
    currentTrack.duration > 0 ? (position / currentTrack.duration) * 100 : 0;

  const isTabBarVisible = segments.length > 0 && segments[0] === '(tabs)';
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 12 : 8);
  const bottomOffset = isTabBarVisible ? 58 + bottomInset : bottomInset;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      {/* Top progress line */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.content}>
        {/* Track details */}
        <View style={styles.trackInfo}>
          <Ionicons name="headset" size={20} color={Colors.primary} />
          <View style={styles.textColumn}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(position)} / {formatTime(currentTrack.duration)} •{' '}
              {currentTrack.language.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Speed Toggle */}
          <TouchableOpacity
            style={styles.speedButton}
            onPress={cycleSpeed}
            accessibilityRole="button"
            accessibilityLabel={`Playback speed ${speed}x`}
          >
            <Text style={styles.speedText}>{speed}x</Text>
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={isPlaying ? pause : resume}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause narration' : 'Resume narration'}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>

          {/* Close / Stop */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={stop}
            accessibilityRole="button"
            accessibilityLabel="Close audio player"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.lg,
    zIndex: 999,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.borderLight,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  speedButton: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  speedText: {
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 6,
  },
});
