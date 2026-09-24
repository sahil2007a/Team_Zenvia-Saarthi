// SAARTHI — Home Screen Nearby Places Section
// Displays 'Places Near You' with approximate area name, horizontal scroll of nearby cards,
// permission explanation, loading states, and manual location fallback.

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { useLocationStore } from '../../store/locationStore';
import { useUserStore } from '../../store/userStore';
import { locationService } from '../../services/location/locationService';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';
import { NearbyPlaceCard } from './NearbyPlaceCard';
import { ManualLocationModal } from './ManualLocationModal';

export const NearbyPlacesSection: React.FC = () => {
  const router = useRouter();
  const coords = useLocationStore((s) => s.currentCoordinates);
  const permissionStatus = useLocationStore((s) => s.permissionStatus);
  const isSimulated = useLocationStore((s) => s.isSimulated);
  const userInterests = useUserStore((s) => s.profile?.interests);

  const [areaName, setAreaName] = useState<string>('your location');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isManualModalVisible, setIsManualModalVisible] = useState(false);

  // Fetch nearby places via TanStack Query
  const {
    data: nearbyPlaces = [],
    isLoading,
    isError,
    refetch,
  } = useNearbyPlaces({
    coordinates: coords,
    radiusKm: 55, // Encompasses city landmarks and nearby heritage (Ramtek, Nagardhan, etc.)
    userInterests,
    enabled: coords !== null,
  });

  // Limit shelf items to top 10 for performance inside HomeScreen vertical ScrollView
  const displayPlaces = useMemo(() => nearbyPlaces.slice(0, 10), [nearbyPlaces]);

  // Resolve approximate area name whenever coordinates update
  useEffect(() => {
    if (!coords) return;
    let isMounted = true;
    locationService.getApproximateAreaName(coords).then((name) => {
      if (isMounted && name) {
        setAreaName(name);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [coords]);

  const handleEnableLocation = async () => {
    setIsRequestingPermission(true);
    try {
      const status = await locationService.requestLocationPermission();
      if (status === 'granted') {
        await locationService.getCurrentLocation();
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleExploreAllNearby = () => {
    router.push('/explore?nearby=true');
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <View style={styles.headingBadgeRow}>
            <View style={styles.accentDot} />
            <Text style={styles.sectionTitle}>Places Near You</Text>
          </View>
          <Text style={styles.subtitle}>
            {coords
              ? `Exploring around ${areaName}`
              : 'Discover monuments and landmarks near you'}
          </Text>
        </View>

        {coords && nearbyPlaces.length > 0 && (
          <TouchableOpacity
            onPress={handleExploreAllNearby}
            style={styles.seeAllBtn}
            accessibilityRole="button"
            accessibilityLabel="Explore all nearby places"
          >
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Case 1: Permission not granted and no coordinates yet */}
      {!coords && (
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconCircle}>
            <Ionicons name="navigate-circle" size={28} color={Colors.secondary} />
          </View>
          <View style={styles.permissionTextCol}>
            <Text style={styles.permissionTitle}>Discover What's Around You</Text>
            <Text style={styles.permissionDesc}>
              Allow location access to find historical places, monuments, and temples near your current position.
            </Text>
            <View style={styles.permissionActions}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleEnableLocation}
                disabled={isRequestingPermission}
                activeOpacity={0.8}
              >
                {isRequestingPermission ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="location" size={15} color={Colors.white} />
                    <Text style={styles.primaryActionText}>Enable Location</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() => setIsManualModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryActionText}>Choose Manually</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Case 2: Loading nearby places */}
      {coords && isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding interesting places near you...</Text>
        </View>
      )}

      {/* Case 3: Empty results (no places within radius) */}
      {coords && !isLoading && nearbyPlaces.length === 0 && (
        <View style={styles.emptyCard}>
          <Ionicons name="compass-outline" size={28} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No famous places found within 35 km</Text>
          <Text style={styles.emptySubtitle}>
            Try exploring all Indian heritage destinations or select an active heritage hub manually.
          </Text>
          <View style={styles.emptyActions}>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              onPress={() => setIsManualModalVisible(true)}
            >
              <Text style={styles.emptyActionText}>Select Heritage Hub</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.emptyActionBtn, styles.emptyActionBtnOutline]}
              onPress={() => router.push('/explore')}
            >
              <Text style={styles.emptyActionTextOutline}>Explore All Sites</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Case 4: Places found -> Horizontal Scroll */}
      {coords && !isLoading && displayPlaces.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsList}
          nestedScrollEnabled
        >
          {displayPlaces.map((item, index) => (
            <NearbyPlaceCard
              key={item.id ? `${item.id}-${index}` : `place-${index}`}
              place={item}
              cardWidth={250}
            />
          ))}
        </ScrollView>
      )}

      {/* Manual Location Selection Modal */}
      <ManualLocationModal
        visible={isManualModalVisible}
        onClose={() => setIsManualModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  titleColumn: {
    flex: 1,
  },
  headingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  sectionTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  seeAllText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  cardsList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  loadingContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
  },
  permissionCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    ...Shadows.sm,
  },
  permissionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTextCol: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  permissionDesc: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  permissionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    gap: 5,
  },
  primaryActionText: {
    color: Colors.white,
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
  },
  secondaryActionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryActionText: {
    color: Colors.textPrimary,
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
  },
  emptyCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emptyTitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 2,
  },
  emptySubtitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  emptyActionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  emptyActionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyActionText: {
    color: Colors.white,
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
  },
  emptyActionTextOutline: {
    color: Colors.textPrimary,
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
  },
});
