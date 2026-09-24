// SAARTHI — Nearby Place Card Component
// Premium, touch-friendly card displaying nearby landmark/heritage info with formatted distance & direct navigation

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
import type { NearbyPlace } from '../../types/place';
import { locationService } from '../../services/location/locationService';
import { GradientPlaceholder } from '../common/GradientPlaceholder';

import { resolveImageSource } from '../../utils/image';

interface NearbyPlaceCardProps {
  place: NearbyPlace;
  cardWidth?: number;
}

const NearbyPlaceCardComponent: React.FC<NearbyPlaceCardProps> = ({
  place,
  cardWidth = 240,
}) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasImage = Boolean(place.imageUrl && !imageError);
  const formattedDistance = locationService.formatDistance(place.distanceMeters);

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Graceful fallback
    }

    if (place.heritageSiteId) {
      router.push(`/site/${place.heritageSiteId}` as any);
    } else {
      router.push(`/place/${place.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${place.name}, ${formattedDistance}`}
    >
      {/* Visual Image Header */}
      <View style={styles.imageContainer}>
        {hasImage ? (
          <>
            <Image
              source={resolveImageSource(place.imageUrl)}
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
            title={place.name}
            category={place.category}
            height={130}
            borderRadius={0}
            unesco={place.verified}
          />
        )}

        {/* Floating Category Tag */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {(place.category || 'Landmark').toUpperCase()}
          </Text>
        </View>

        {/* Floating Distance Pill */}
        <View style={styles.distanceBadge}>
          <Ionicons name="navigate" size={11} color={Colors.white} />
          <Text style={styles.distanceBadgeText}>{formattedDistance}</Text>
        </View>
      </View>

      {/* Card Content Body */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {place.name}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {place.city || place.state || 'India'}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {place.shortDescription || place.description}
        </Text>

        {/* Footer row */}
        <View style={styles.footer}>
          {place.verified && (
            <View style={styles.verifiedTag}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          <View style={styles.exploreBtn}>
            <Text style={styles.exploreText}>View</Text>
            <Ionicons name="arrow-forward" size={12} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const NearbyPlaceCard = React.memo(NearbyPlaceCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  imageContainer: {
    height: 130,
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
  categoryBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(27, 40, 56, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  categoryBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(196, 150, 60, 0.92)', // Warm Gold
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  distanceBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: Spacing.xs + 2,
  },
  locationText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.success,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
  },
  exploreText: {
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
});
