// SAARTHI Design System — Gradient / Architectural Motif Placeholder
// Renders a rich visual header for monuments without requiring external network image assets

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/layout';
import { Ionicons } from '@expo/vector-icons';

interface GradientPlaceholderProps {
  title: string;
  category?: string;
  height?: number;
  borderRadius?: number;
  unesco?: boolean;
}

export const GradientPlaceholder: React.FC<GradientPlaceholderProps> = ({
  title,
  category = 'Monument',
  height = 180,
  borderRadius = BorderRadius.lg,
  unesco = false,
}) => {
  // Select dynamic architectural palette based on category
  const getPalette = () => {
    switch (category?.toLowerCase()) {
      case 'temple':
        return {
          bg: '#8B263E',
          accent: '#D4A373',
          icon: 'bonfire-outline' as const,
        };
      case 'fort':
        return {
          bg: '#9E2A2B',
          accent: '#E09F3E',
          icon: 'shield-outline' as const,
        };
      case 'cave':
        return {
          bg: '#283618',
          accent: '#DDA15E',
          icon: 'planet-outline' as const,
        };
      case 'palace':
        return {
          bg: '#5E503F',
          accent: '#C6AC8F',
          icon: 'business-outline' as const,
        };
      default:
        return {
          bg: '#3D0C11',
          accent: '#E36414',
          icon: 'sparkles-outline' as const,
        };
    }
  };

  const palette = getPalette();

  return (
    <View
      style={[
        styles.container,
        {
          height,
          borderRadius,
          backgroundColor: palette.bg,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Illustration of ${title}`}
    >
      {/* Geometric background patterns simulating architectural archways */}
      <View style={[styles.archPattern, { borderColor: 'rgba(255,255,255,0.08)' }]} />
      <View style={[styles.innerArch, { borderColor: 'rgba(255,255,255,0.12)' }]} />

      {/* UNESCO tag if applicable */}
      {unesco && (
        <View style={styles.unescoTag}>
          <Ionicons name="ribbon" size={14} color="#FFD700" />
          <Text style={styles.unescoText}>UNESCO WORLD HERITAGE</Text>
        </View>
      )}

      {/* Center Motif Icon */}
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
        <Ionicons name={palette.icon} size={32} color={palette.accent} />
      </View>

      {/* Overlay caption info */}
      <View style={styles.contentOverlay}>
        <Text style={styles.categoryLabel}>{category.toUpperCase()}</Text>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  archPattern: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    top: -40,
  },
  innerArch: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    top: -5,
  },
  unescoTag: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  unescoText: {
    color: '#FFD700',
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  categoryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 1,
  },
  titleText: {
    color: Colors.white,
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
