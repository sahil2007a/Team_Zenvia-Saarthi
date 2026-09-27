// SAARTHI Design System — Heritage Site Card Component
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import type { HeritageSite } from '../../types/heritage';
import { GradientPlaceholder } from '../common/GradientPlaceholder';
import { Badge } from '../common/Badge';
import { useUserStore } from '../../store/userStore';
import { resolveImageSource } from '../../utils/image';

interface SiteCardProps {
  site: HeritageSite;
  distanceKm?: number;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, distanceKm }) => {
  const router = useRouter();
  const isLargeText = useUserStore((s) => s.profile.accessibility.largeText);
  const isSaved = useUserStore((s) => s.profile.savedSites.includes(site.id));
  const toggleSavedSite = useUserStore((s) => s.toggleSavedSite);

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = site.images && site.images.length > 0 && !imageError;

  const handlePress = () => {
    router.push(`/site/${site.id}`);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardTouchArea}
        onPress={handlePress}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${site.name}`}
      >
        {/* Visual Header / Photo */}
        <View style={styles.imageContainer}>
          {hasImage ? (
            <>
              <Image
                source={resolveImageSource(site.images[0])}
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
              <View style={styles.imageDarkGradient} />
              {site.unesco && (
                <View style={styles.unescoTag}>
                  <Ionicons name="ribbon-outline" size={13} color={Colors.white} />
                  <Text style={styles.unescoTagText}>UNESCO HERITAGE</Text>
                </View>
              )}
            </>
          ) : (
            <GradientPlaceholder
              title={site.name}
              category={site.heritageType}
              height={160}
              borderRadius={0}
              unesco={site.unesco}
            />
          )}
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Badges row */}
          <View style={styles.badgeRow}>
            <Badge label={site.heritageType} variant="secondary" size="sm" />
            {site.asiProtected && (
              <Badge label="ASI PROTECTED" variant="info" size="sm" />
            )}
            {site.offlineAvailable && (
              <Badge label="OFFLINE READY" variant="success" size="sm" />
            )}
          </View>

          {/* Site Name & Location */}
          <Text
            style={[styles.siteName, isLargeText && styles.largeSiteName]}
            numberOfLines={1}
          >
            {site.name}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {site.city}, {site.state}
            </Text>
            {distanceKm !== undefined && (
              <Text style={styles.distanceText}>• {distanceKm} km away</Text>
            )}
          </View>

          {/* Short Summary Description */}
          <Text style={styles.description} numberOfLines={2}>
            {site.shortDescription}
          </Text>

          {/* Footer info: Duration & Languages */}
          <View style={styles.footerRow}>
            <View style={styles.infoPill}>
              <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.infoPillText}>{site.estimatedVisitTime}</Text>
            </View>
            <View style={styles.infoPill}>
              <Ionicons name="volume-medium-outline" size={13} color={Colors.primary} />
              <Text style={[styles.infoPillText, { color: Colors.primary }]}>
                {site.languages.map((l) => l.toUpperCase()).join(' • ')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Bookmark quick action - direct child of View to eliminate invalid button nesting */}
      <TouchableOpacity
        style={styles.bookmarkButton}
        onPress={(e) => {
          e.stopPropagation?.();
          toggleSavedSite(site.id);
        }}
        accessibilityRole="button"
        accessibilityLabel={isSaved ? 'Remove from saved' : 'Save site'}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color={isSaved ? Colors.primary : Colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
    ...Shadows.md,
  },
  cardTouchArea: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
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
  imageDarkGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  unescoTag: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 40, 56, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  unescoTagText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  bookmarkButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  body: {
    padding: Spacing.md + 2,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  siteName: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  largeSiteName: {
    fontSize: Typography.largeScale.h3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  distanceText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  description: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoPillText: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
});
