// SAARTHI — Heritage Hero Carousel Card
// Implements rich, responsive card for featured heritage sites with image fallback and haptic interaction

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import type { HeritageSite } from '../../types/heritage';
import { GradientPlaceholder } from '../common/GradientPlaceholder';
import { Badge } from '../common/Badge';
import { useUserStore } from '../../store/userStore';
import { resolveImageSource } from '../../utils/image';

interface HeritageCardProps {
  site: HeritageSite;
  cardWidth: number;
}

const HeritageCardComponent: React.FC<HeritageCardProps> = ({ site, cardWidth }) => {
  const router = useRouter();
  const isLargeText = useUserStore((s) => s.profile?.accessibility?.largeText);

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const primaryImage = site.images && site.images.length > 0 ? site.images[0] : null;
  const hasValidImage = Boolean(primaryImage && !imageError);

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Graceful fallback on web or unsupported devices
    }
    router.push(`/site/${site.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.92}
      accessibilityRole="button"
      accessibilityLabel={`View heritage site details for ${site.name}, located in ${site.city}, ${site.state}`}
    >
      {/* Image Container with Fallback and Badges */}
      <View style={styles.imageContainer}>
        {hasValidImage ? (
          <>
            <Image
              source={resolveImageSource(primaryImage)}
              style={styles.image}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            )}
            <View style={styles.imageScrim} />
          </>
        ) : (
          <GradientPlaceholder
            title={site.name}
            category={site.heritageType}
            height={155}
            borderRadius={0}
            unesco={site.unesco}
          />
        )}

        {/* Floating Badges */}
        <View style={styles.badgeOverlay}>
          {site.unesco && (
            <View style={styles.unescoPill}>
              <Ionicons name="ribbon" size={12} color={Colors.secondaryLight} />
              <Text style={styles.unescoPillText}>UNESCO</Text>
            </View>
          )}

          {site.offlineAvailable && (
            <View style={styles.offlinePill}>
              <Ionicons name="cloud-offline" size={11} color={Colors.white} />
              <Text style={styles.offlinePillText}>OFFLINE</Text>
            </View>
          )}
        </View>
      </View>

      {/* Card Body Content */}
      <View style={styles.content}>
        {/* Category & ASI Protected Row */}
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText}>
            {site.heritageType.toUpperCase()}
          </Text>
          {site.asiProtected && (
            <Text style={styles.asiText}>• ASI PROTECTED</Text>
          )}
        </View>

        {/* Title */}
        <Text
          style={[styles.title, isLargeText && styles.largeTitle]}
          numberOfLines={1}
        >
          {site.name}
        </Text>

        {/* Location Row */}
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={13} color={Colors.secondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {site.city}, {site.state}
          </Text>
        </View>

        {/* Short Description */}
        <Text style={styles.description} numberOfLines={2}>
          {site.shortDescription || site.description}
        </Text>

        {/* Metadata Footer */}
        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{site.estimatedVisitTime}</Text>
          </View>
          <View style={styles.exploreAction}>
            <Text style={styles.exploreActionText}>Explore</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const HeritageCard = React.memo(HeritageCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  imageContainer: {
    height: 155,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.surfaceVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(27, 40, 56, 0.15)',
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unescoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 25, 35, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  unescoPillText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.6,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 125, 70, 0.9)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    gap: 3,
  },
  offlinePillText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  content: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.secondary,
    letterSpacing: 0.6,
  },
  asiText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  largeTitle: {
    fontSize: Typography.largeScale.h3,
    lineHeight: 26,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    marginBottom: 6,
  },
  locationText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: Typography.scale.caption + 1,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  exploreAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  exploreActionText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
});
