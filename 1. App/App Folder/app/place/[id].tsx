// SAARTHI — General Nearby Place Detail Screen
// Provides detailed discovery for landmarks, monuments, and attractions with distance, history, and AI Guide action

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { nearbyPlacesService } from '../../services/places/nearbyPlacesService';
import { locationService } from '../../services/location/locationService';
import { useLocationStore } from '../../store/locationStore';
import { useUserStore } from '../../store/userStore';
import type { NearbyPlace } from '../../types/place';
import { GradientPlaceholder } from '../../components/common/GradientPlaceholder';
import { Button } from '../../components/common/Button';
import { resolveImageSource } from '../../utils/image';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const currentCoords = useLocationStore((s) => s.currentCoordinates);
  const isSaved = useUserStore((s) => s.profile?.savedSites?.includes(id || ''));
  const toggleSavedSite = useUserStore((s) => s.toggleSavedSite);

  const [place, setPlace] = useState<NearbyPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;
    nearbyPlacesService.getPlaceDetails(id).then((p) => {
      setPlace(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textTertiary} />
        <Text style={styles.errorTitle}>Place details unavailable</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          size="sm"
          style={{ marginTop: Spacing.md }}
        />
      </View>
    );
  }

  // Calculate real distance if coordinates exist
  const distanceMeters = currentCoords
    ? locationService.calculateDistanceMeters(currentCoords, {
        latitude: place.latitude,
        longitude: place.longitude,
      })
    : place.distanceMeters;

  const formattedDistance = locationService.formatDistance(distanceMeters);

  const handleAskAIGuide = () => {
    router.push('/guide');
  };

  const handleDirections = () => {
    const url =
      place.directionsUrl ||
      `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Location Coordinates',
            `${place.name} is located at:\nLatitude: ${place.latitude.toFixed(4)}\nLongitude: ${place.longitude.toFixed(4)}\nDistance: ${formattedDistance}`
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Location Coordinates',
          `${place.name} is located at:\nLatitude: ${place.latitude.toFixed(4)}\nLongitude: ${place.longitude.toFixed(4)}\nDistance: ${formattedDistance}`
        );
      });
  };

  const handleToggleBookmark = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    toggleSavedSite(place.id);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Visual Hero Header with Back & Bookmark Buttons */}
        <View style={styles.heroImageContainer}>
          {place.imageUrl && !imageError ? (
            <>
              <Image
                source={resolveImageSource(place.imageUrl)}
                style={styles.heroImage}
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              )}
              <View style={styles.heroScrim} />
            </>
          ) : (
            <GradientPlaceholder
              title={place.name}
              category={place.category}
              height={260}
              borderRadius={0}
              unesco={place.verified}
            />
          )}

          {/* Top Bar Actions */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconCircle}
              onPress={handleToggleBookmark}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remove from saved' : 'Save place'}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isSaved ? Colors.primary : Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Floating Distance Badge */}
          <View style={styles.floatingDistance}>
            <Ionicons name="navigate" size={13} color={Colors.white} />
            <Text style={styles.floatingDistanceText}>{formattedDistance}</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Category & Status */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{place.category.toUpperCase()}</Text>
            </View>
            {place.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
                <Text style={styles.verifiedBadgeText}>VERIFIED SOURCE</Text>
              </View>
            )}
          </View>

          {/* Place Title */}
          <Text style={styles.title}>{place.name}</Text>

          {/* City, State & Rating Row */}
          <View style={styles.locationAndRatingRow}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={15} color={Colors.secondary} />
              <Text style={styles.locationText}>
                {place.city ? `${place.city}, ${place.state}` : place.country}
              </Text>
            </View>

            {place.rating !== undefined && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={13} color="#E76F51" />
                <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
                {place.reviewCount !== undefined && (
                  <Text style={styles.reviewCountText}>
                    ({place.reviewCount >= 1000 ? `${(place.reviewCount / 1000).toFixed(1)}K` : place.reviewCount})
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Deep Official Heritage Site Bridge Card (if site exists in catalog) */}
          {place.heritageSiteId && (
            <TouchableOpacity
              style={styles.heritageBridgeCard}
              onPress={() => router.push(`/site/${place.heritageSiteId}` as any)}
              activeOpacity={0.85}
            >
              <View style={styles.heritageBridgeIconCircle}>
                <Ionicons name="sparkles" size={18} color={Colors.primary} />
              </View>
              <View style={styles.heritageBridgeTextCol}>
                <Text style={styles.heritageBridgeTitle}>Official Heritage Experience Available</Text>
                <Text style={styles.heritageBridgeSubtitle}>
                  Explore 3D site view, audio stories, interactive timeline & facility guide
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          )}

          {/* Visiting Details Grid */}
          <View style={styles.infoGrid}>
            {place.openingHours && (
              <View style={styles.infoBox}>
                <Ionicons name="time-outline" size={18} color={Colors.primary} />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Hours</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>{place.openingHours}</Text>
                </View>
              </View>
            )}

            {place.entryFee && (
              <View style={styles.infoBox}>
                <Ionicons name="cash-outline" size={18} color={Colors.primary} />
                <View style={styles.infoTextCol}>
                  <Text style={styles.infoLabel}>Entry Fee</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>{place.entryFee}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Official Website Button if available */}
          {place.websiteUrl && (
            <TouchableOpacity
              style={styles.websiteBtn}
              onPress={() => Linking.openURL(place.websiteUrl!)}
              activeOpacity={0.8}
            >
              <Ionicons name="globe-outline" size={16} color={Colors.primary} />
              <Text style={styles.websiteBtnText}>Official Website</Text>
              <Ionicons name="open-outline" size={13} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}

          {/* About / Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>About This Place</Text>
            <Text style={styles.descriptionText}>{place.description}</Text>
          </View>

          {/* Highlights / Why It Matters */}
          {place.highlights && place.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Highlights & Themes</Text>
              <View style={styles.highlightsRow}>
                {place.highlights.map((h, i) => (
                  <View key={i} style={styles.highlightPill}>
                    <Text style={styles.highlightPillText}>#{h}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Source Provenance */}
          {place.source && (
            <View style={styles.provenanceBox}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.provenanceText}>
                Information cataloged from: <Text style={styles.provenanceBold}>{place.source}</Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleDirections}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate-outline" size={18} color={Colors.primary} />
          <Text style={styles.directionsButtonText}>Location Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guideButton}
          onPress={handleAskAIGuide}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color={Colors.white} />
          <Text style={styles.guideButtonText}>Ask AI Guide</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  heroImageContainer: {
    height: 260,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.surfaceVariant,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(27, 40, 56, 0.25)',
  },
  topBar: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  floatingDistance: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(196, 150, 60, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  floatingDistanceText: {
    color: Colors.white,
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
  },
  body: {
    padding: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs + 2,
  },
  categoryBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.success,
    letterSpacing: 0.4,
  },
  title: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: 4,
  },
  locationAndRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  locationText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    gap: 3,
  },
  ratingText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  reviewCountText: {
    fontSize: 11,
    fontFamily: Typography.fonts.sans,
    color: Colors.textTertiary,
  },
  heritageBridgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(196, 150, 60, 0.08)',
    borderColor: 'rgba(196, 150, 60, 0.3)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  heritageBridgeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(196, 150, 60, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heritageBridgeTextCol: {
    flex: 1,
  },
  heritageBridgeTitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  heritageBridgeSubtitle: {
    fontSize: 11,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  websiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.round,
    gap: 6,
    marginBottom: Spacing.lg,
  },
  websiteBtnText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: Typography.fonts.sans,
    color: Colors.textTertiary,
  },
  infoValue: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  highlightPill: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
  },
  highlightPillText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.primary,
  },
  provenanceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  provenanceText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  provenanceBold: {
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    ...Shadows.md,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  directionsButtonText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  guideButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  guideButtonText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
  },
});
