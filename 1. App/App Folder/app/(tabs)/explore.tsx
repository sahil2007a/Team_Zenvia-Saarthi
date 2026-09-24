// SAARTHI — Heritage Discovery / Gallery Screen (UI Reference Screen 2)
// Implements Hamburger Menu, Search, Category Tabs, Multi-Criteria Filter Modal,
// Large Image Discovery Cards, Live Proximity Distances, and List/Map Toggle.

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { heritageSites } from '../../data/sites';
import { useLocationStore } from '../../store/locationStore';
import { useUserStore } from '../../store/userStore';
import { locationService } from '../../services/location/locationService';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';
import { ManualLocationModal } from '../../components/location/ManualLocationModal';
import { FilterModal, type FilterCriteria } from '../../components/explore/FilterModal';
import { DiscoveryCard, type DiscoveryCardItem } from '../../components/explore/DiscoveryCard';
import { ExploreDrawerModal } from '../../components/explore/ExploreDrawerModal';
import type { NearbyPlace } from '../../types/place';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ nearby?: string; category?: string }>();

  // Navigation & Drawer State
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isManualLocationModalVisible, setManualLocationModalVisible] = useState(false);

  // Search & Categories State (matching Reference Screen 2)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter Criteria State
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    state: 'All',
    maxDistanceKm: null,
    unescoOnly: false,
    asiOnly: false,
    visitDuration: 'all',
    accessibleOnly: false,
    offlineOnly: false,
  });

  // User & Location State
  const currentCoords = useLocationStore((s) => s.currentCoordinates);
  const user = useUserStore((s) => s.profile);
  const [areaName, setAreaName] = useState<string>('Nagpur & Vidarbha');
  const [selectedMapPlace, setSelectedMapPlace] = useState<DiscoveryCardItem | null>(null);

  // Sync category param if passed from outside
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
  }, [params.category]);

  // Resolve approximate area name
  useEffect(() => {
    if (currentCoords) {
      locationService.getApproximateAreaName(currentCoords).then((name) => {
        if (name) setAreaName(name);
      });
    } else {
      setAreaName('Nagpur & Vidarbha');
    }
  }, [currentCoords]);

  // Categories matching Screen 2 reference
  const categoryTabs = [
    { id: 'all', label: 'All' },
    { id: 'Fort', label: 'Fort' },
    { id: 'Temple', label: 'Temple' },
    { id: 'Palace', label: 'Palace' },
    { id: 'Monument', label: 'Monument' },
    { id: 'Museum', label: 'Museum' },
    { id: 'Cave', label: 'Cave' },
    { id: 'Archaeological', label: 'Archaeological Site' },
  ];

  // Fetch nearby places via TanStack Query when location is available
  const { data: nearbyPlaces = [], isLoading: isLoadingNearby } = useNearbyPlaces({
    coordinates: currentCoords,
    radiusKm: filterCriteria.maxDistanceKm || 60,
    category: selectedCategory,
    query: searchQuery,
    userInterests: user.interests,
    enabled: currentCoords !== null,
  });

  // Unified Discovery Items catalog combining heritage sites + nearby places catalog
  const discoveryItems = useMemo<DiscoveryCardItem[]>(() => {
    // 1. Transform HeritageSites
    const sitesAsItems: DiscoveryCardItem[] = heritageSites.map((site) => {
      let distanceMeters: number | undefined = undefined;
      if (currentCoords) {
        distanceMeters = Math.round(
          locationService.calculateDistanceKm(currentCoords, site.coordinates) * 1000
        );
      }
      return {
        id: site.id,
        name: site.name,
        city: site.city,
        state: site.state,
        country: site.country,
        category: site.heritageType,
        imageUrl: site.images[0],
        shortDescription: site.shortDescription,
        description: site.description,
        unesco: site.unesco,
        asiProtected: site.asiProtected,
        duration: site.estimatedVisitTime,
        distanceMeters,
        offlineAvailable: site.offlineAvailable,
        heritageSiteId: site.id,
        has360Experience: true,
      };
    });

    // 2. Transform NearbyPlaces that aren't already represented by a HeritageSite
    const nearbyAsItems: DiscoveryCardItem[] = nearbyPlaces
      .filter((np) => !np.heritageSiteId || !sitesAsItems.some((s) => s.id === np.heritageSiteId))
      .map((np) => ({
        id: np.id,
        name: np.name,
        city: np.city || 'Nagpur',
        state: np.state || 'Maharashtra',
        country: np.country || 'India',
        category: np.category,
        imageUrl: np.imageUrl,
        shortDescription: np.shortDescription,
        description: np.description,
        unesco: false,
        asiProtected: np.verified,
        duration: '1-2 hours',
        distanceMeters: np.distanceMeters,
        offlineAvailable: true,
        heritageSiteId: np.heritageSiteId,
        has360Experience: true,
      }));

    // Combine and deduplicate
    const combined = [...sitesAsItems, ...nearbyAsItems];

    // Apply Filter Criteria
    return combined.filter((item) => {
      // Query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Category tab filter
      if (selectedCategory !== 'all') {
        const itemCat = item.category.toLowerCase();
        const selected = selectedCategory.toLowerCase();
        const matchesCategory =
          itemCat.includes(selected) ||
          selected.includes(itemCat) ||
          (selected === 'archaeological' && (itemCat.includes('archaeolog') || itemCat.includes('ancient')));
        if (!matchesCategory) return false;
      }

      // State filter
      if (
        filterCriteria.state !== 'All' &&
        item.state.toLowerCase() !== filterCriteria.state.toLowerCase()
      ) {
        return false;
      }

      // Proximity distance filter
      if (
        filterCriteria.maxDistanceKm !== null &&
        item.distanceMeters !== undefined &&
        item.distanceMeters > filterCriteria.maxDistanceKm * 1000
      ) {
        return false;
      }

      // UNESCO filter
      if (filterCriteria.unescoOnly && !item.unesco) return false;

      // ASI filter
      if (filterCriteria.asiOnly && !item.asiProtected) return false;

      // Offline filter
      if (filterCriteria.offlineOnly && !item.offlineAvailable) return false;

      // Duration filter
      if (filterCriteria.visitDuration !== 'all' && item.duration) {
        if (
          filterCriteria.visitDuration === '< 1 hr' &&
          !item.duration.toLowerCase().includes('< 1') &&
          !item.duration.toLowerCase().includes('30')
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort by proximity if distance is available, otherwise by name
      if (a.distanceMeters !== undefined && b.distanceMeters !== undefined) {
        return a.distanceMeters - b.distanceMeters;
      }
      return a.name.localeCompare(b.name);
    });
  }, [heritageSites, nearbyPlaces, currentCoords, searchQuery, selectedCategory, filterCriteria]);

  // Active filters count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterCriteria.state !== 'All') count++;
    if (filterCriteria.maxDistanceKm !== null) count++;
    if (filterCriteria.unescoOnly) count++;
    if (filterCriteria.asiOnly) count++;
    if (filterCriteria.visitDuration !== 'all') count++;
    if (filterCriteria.accessibleOnly) count++;
    if (filterCriteria.offlineOnly) count++;
    return count;
  }, [filterCriteria]);

  const handleResetAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setFilterCriteria({
      state: 'All',
      maxDistanceKm: null,
      unescoOnly: false,
      asiOnly: false,
      visitDuration: 'all',
      accessibleOnly: false,
      offlineOnly: false,
    });
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Bar matching Screen 2 reference */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => setDrawerVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Open navigation menu"
        >
          <Ionicons name="menu" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.headerLogo}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle}>SAARTHI</Text>
        </View>

        <TouchableOpacity
          style={styles.profileAvatarBtn}
          onPress={() => router.push('/profile')}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Text style={styles.profileAvatarText}>
            {(user.name || 'E').slice(0, 1).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Functional Search Bar & Filter Button */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputBox}>
            <Ionicons name="search" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.filterTriggerBtn,
              activeFiltersCount > 0 && styles.filterTriggerBtnActive,
            ]}
            onPress={() => setFilterModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`Filter items, ${activeFiltersCount} active`}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFiltersCount > 0 ? Colors.white : Colors.primary}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadgeCount}>
                <Text style={styles.filterBadgeCountText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 3. Horizontal Category Tabs matching Screen 2 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {categoryTabs.map((tab) => {
            const isSelected = selectedCategory.toLowerCase() === tab.id.toLowerCase();
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.categoryTab, isSelected && styles.categoryTabActive]}
                onPress={() => setSelectedCategory(tab.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    isSelected && styles.categoryTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. Active Area Badge & View Switcher (List | Map) */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.areaBadge}
            onPress={() => setManualLocationModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="location-sharp" size={12} color={Colors.primary} />
            <Text style={styles.areaBadgeText} numberOfLines={1}>
              {currentCoords ? `Near ${areaName}` : 'Nagpur & Vidarbha'}
            </Text>
            <Ionicons name="chevron-down" size={10} color={Colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.segmentedSwitcher}>
            <TouchableOpacity
              style={[styles.segmentBtn, viewMode === 'list' && styles.segmentBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="grid-outline"
                size={13}
                color={viewMode === 'list' ? Colors.white : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  viewMode === 'list' && styles.segmentBtnTextActive,
                ]}
              >
                LIST
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentBtn, viewMode === 'map' && styles.segmentBtnActive]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons
                name="map-outline"
                size={13}
                color={viewMode === 'map' ? Colors.white : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.segmentBtnText,
                  viewMode === 'map' && styles.segmentBtnTextActive,
                ]}
              >
                MAP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 5. CONTENT AREA */}
      {viewMode === 'list' ? (
        <FlatList
          data={discoveryItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DiscoveryCard item={item} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="compass-outline" size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>No heritage places found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search query, selecting another category, or resetting active filters.
              </Text>
              <TouchableOpacity
                style={styles.resetAllBtn}
                onPress={handleResetAll}
                activeOpacity={0.8}
              >
                <Text style={styles.resetAllBtnText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        /* MAP VIEW */
        <View style={styles.mapContainer}>
          <View style={styles.mapCanvas}>
            <View style={styles.mapGridBackground}>
              <Ionicons name="map" size={72} color="rgba(196, 150, 60, 0.12)" />
              <Text style={styles.mapCanvasHeader}>
                Interactive Heritage Schematic Map
              </Text>
              <Text style={styles.mapCanvasSub}>
                Showing {discoveryItems.length} locations around {areaName}
              </Text>
            </View>

            {/* Simulated interactive pins */}
            {discoveryItems.slice(0, 8).map((place, idx) => {
              const posX = 15 + ((idx * 24) % 70);
              const posY = 15 + ((idx * 28) % 65);
              const isSelected = selectedMapPlace?.id === place.id;
              return (
                <TouchableOpacity
                  key={place.id}
                  style={[
                    styles.mapPin,
                    { left: `${posX}%`, top: `${posY}%` },
                    isSelected && styles.mapPinActive,
                  ]}
                  onPress={() => setSelectedMapPlace(place)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="location"
                    size={isSelected ? 26 : 20}
                    color={isSelected ? Colors.secondary : Colors.primary}
                  />
                  <Text style={styles.mapPinLabel} numberOfLines={1}>
                    {place.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Pin Preview Card */}
          {selectedMapPlace && (
            <View style={styles.mapBottomCard}>
              <DiscoveryCard item={selectedMapPlace} />
            </View>
          )}
        </View>
      )}

      {/* Navigation Drawer Modal */}
      <ExploreDrawerModal
        visible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      {/* Multi-Criteria Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        criteria={filterCriteria}
        onApply={(newCrit) => setFilterCriteria(newCrit)}
        onReset={() =>
          setFilterCriteria({
            state: 'All',
            maxDistanceKm: null,
            unescoOnly: false,
            asiOnly: false,
            visitDuration: 'all',
            accessibleOnly: false,
            offlineOnly: false,
          })
        }
      />

      {/* Manual Location Modal */}
      <ManualLocationModal
        visible={isManualLocationModalVisible}
        onClose={() => setManualLocationModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    backgroundColor: Colors.surface,
    paddingTop: 34,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  profileAvatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  profileAvatarText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  searchInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textPrimary,
    padding: 0,
  },
  filterTriggerBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  filterTriggerBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterBadgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  filterBadgeCountText: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
  },
  categoryTabsContent: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryTabActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  categoryTabText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  categoryTabTextActive: {
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
  },
  areaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(196, 150, 60, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
    maxWidth: '55%',
  },
  areaBadgeText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.primary,
  },
  segmentedSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.round,
    padding: 2,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
  },
  segmentBtnText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  segmentBtnTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: 110,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySub: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  resetAllBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
  },
  resetAllBtnText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: Spacing.lg,
    marginBottom: 110,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mapGridBackground: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  mapCanvasHeader: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  mapCanvasSub: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -24 }],
  },
  mapPinActive: {
    transform: [{ translateX: -15 }, { translateY: -30 }],
    zIndex: 10,
  },
  mapPinLabel: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    color: Colors.textPrimary,
    maxWidth: 80,
  },
  mapBottomCard: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 20,
  },
});
