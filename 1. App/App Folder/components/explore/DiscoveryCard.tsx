// SAARTHI — Large Image Discovery Card (UI Reference Screen 2)
// Displays large visual image, UNESCO/Category badges, distance, duration, and direct 360° VR trigger

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
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import type { HeritageSite } from '../../types/heritage';
import type { NearbyPlace } from '../../types/place';
import { locationService } from '../../services/location/locationService';
import { resolveImageSource } from '../../utils/image';

// Unified card data model accepting either a HeritageSite or a NearbyPlace
export type DiscoveryCardItem = {
  id: string;
  name: string;
  city: string;
  state: string;
  country?: string;
  category: string;
  imageUrl?: string | any;
  shortDescription?: string;
  description: string;
  unesco?: boolean;
  asiProtected?: boolean;
  duration?: string;
  distanceMeters?: number;
  offlineAvailable?: boolean;
  heritageSiteId?: string;
  has360Experience?: boolean;
};

interface DiscoveryCardProps {
  item: DiscoveryCardItem;
  onPress?: () => void;
  onExperiencePress?: () => void;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({
  item,
  onPress,
  onExperiencePress,
}) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardPress = () => {
    if (onPress) {
      onPress();
      return;
    }
    const targetId = item.heritageSiteId || item.id;
    // Route to full site details
    router.push(`/site/${targetId}` as any);
  };

  const handleLaunch360 = (e: any) => {
    e.stopPropagation?.();
    if (onExperiencePress) {
      onExperiencePress();
      return;
    }
    const targetId = item.heritageSiteId || item.id;
    router.push(`/site/${targetId}/experience` as any);
  };

  const formattedDistance = item.distanceMeters !== undefined
    ? locationService.formatDistance(item.distanceMeters)
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, located in ${item.city}, ${item.state}`}
    >
      {/* Large Visual Image Container */}
      <View style={styles.imageContainer}>
        {item.imageUrl && !imageError ? (
          <Image
            source={resolveImageSource(item.imageUrl)}
            style={styles.image}
            resizeMode="cover"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.fallbackContainer}>
            <Ionicons name="image-outline" size={40} color={Colors.textTertiary} />
          </View>
        )}

        {!imageLoaded && !imageError && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )}

        {/* Top Badges (Category & UNESCO) */}
        <View style={styles.topBadgesRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
          </View>

          {item.unesco && (
            <View style={styles.unescoBadge}>
              <Ionicons name="ribbon-sharp" size={11} color={Colors.white} />
              <Text style={styles.unescoBadgeText}>UNESCO</Text>
            </View>
          )}
        </View>

        {/* 360° AR Quick Launcher Button Overlay */}
        <TouchableOpacity
          style={styles.vrFloatingBtn}
          onPress={handleLaunch360}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityLabel="Launch 360 AR Experience"
        >
          <Ionicons name="scan-outline" size={13} color={Colors.white} />
          <Text style={styles.vrFloatingBtnText}>360° AR</Text>
        </TouchableOpacity>

        {/* Distance Badge if available */}
        {formattedDistance && (
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate" size={11} color={Colors.white} />
            <Text style={styles.distanceBadgeText}>{formattedDistance}</Text>
          </View>
        )}
      </View>

      {/* Card Content Information */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Location Subtitle */}
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={13} color={Colors.secondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.city}, {item.state}
          </Text>
        </View>

        {/* Description Snippet */}
        <Text style={styles.description} numberOfLines={2}>
          {item.shortDescription || item.description}
        </Text>

        {/* Bottom Feature Pills (Duration, Offline, ASI) */}
        <View style={styles.footerRow}>
          <View style={styles.pillsRow}>
            {item.duration && (
              <View style={styles.featurePill}>
                <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.featurePillText}>{item.duration}</Text>
              </View>
            )}

            {item.asiProtected && (
              <View style={styles.featurePill}>
                <Ionicons name="shield-checkmark" size={12} color={Colors.primary} />
                <Text style={styles.featurePillText}>ASI</Text>
              </View>
            )}

            {item.offlineAvailable && (
              <View style={styles.featurePill}>
                <Ionicons name="cloud-done-outline" size={12} color={Colors.success} />
                <Text style={styles.featurePillText}>Offline</Text>
              </View>
            )}
          </View>

          <View style={styles.exploreArrow}>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: Colors.surfaceVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
  },
  topBadgesRow: {
    position: 'absolute',
    top: Spacing.sm + 2,
    left: Spacing.sm + 2,
    flexDirection: 'row',
    gap: 6,
    zIndex: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    backdropFilter: 'blur(8px)',
  },
  categoryBadgeText: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  unescoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    gap: 3,
  },
  unescoBadgeText: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  vrFloatingBtn: {
    position: 'absolute',
    top: Spacing.sm + 2,
    right: Spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(196, 150, 60, 0.95)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
    zIndex: 2,
    ...Shadows.sm,
  },
  vrFloatingBtnText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
    letterSpacing: 0.4,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  distanceBadgeText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.white,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  featurePillText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  exploreArrow: {
    paddingLeft: Spacing.xs,
  },
});
