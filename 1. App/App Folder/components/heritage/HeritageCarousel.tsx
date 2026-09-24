// SAARTHI — Heritage Hero Carousel Component
// Implements horizontal auto-scrolling carousel of featured heritage sites with manual swipe, touch pause, and pagination

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/layout';
import type { HeritageSite } from '../../types/heritage';
import { heritageSites, getSiteById } from '../../data/sites';
import { useLocationStore } from '../../store/locationStore';
import { locationService } from '../../services/location/locationService';
import { HeritageCard } from './HeritageCard';
import { CarouselPagination } from './CarouselPagination';

interface HeritageCarouselProps {
  sites?: HeritageSite[];
  autoScrollIntervalMs?: number;
}

export const HeritageCarousel: React.FC<HeritageCarouselProps> = ({
  sites,
  autoScrollIntervalMs = 4500,
}) => {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const userCoords = useLocationStore((s) => s.currentCoordinates);

  // Curate premier heritage sites with dynamic location proximity boost
  const featuredSites = useMemo(() => {
    if (sites && sites.length > 0) return sites;
    const curatedIds = [
      'india-gate',
      'qutub-minar',
      'deekshabhoomi',
      'taj-mahal',
      'hampi',
      'ellora-caves',
      'ajanta-caves',
    ];
    const curated = curatedIds
      .map((id) => getSiteById(id))
      .filter((s): s is HeritageSite => Boolean(s));

    const list = curated.length > 0 ? curated : heritageSites.slice(0, 6);

    // Featured monuments: ensure India Gate and Qutub Minar stay prominent at the front of the carousel
    if (userCoords) {
      const pinnedIds = ['india-gate', 'qutub-minar'];
      const pinned = list.filter((s) => pinnedIds.includes(s.id));
      const others = list.filter((s) => !pinnedIds.includes(s.id));
      others.sort((a, b) => {
        const distA = locationService.calculateDistanceKm(userCoords, a.coordinates);
        const distB = locationService.calculateDistanceKm(userCoords, b.coordinates);
        return distA - distB;
      });
      return [...pinned, ...others];
    }

    return list;
  }, [sites, userCoords]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const flatListRef = useRef<FlatList<HeritageSite>>(null);

  // Card dimensions: responsive to phone width while leaving right margin peek
  const cardGap = Spacing.md;
  const cardWidth = useMemo(() => {
    // Leave room for screen padding (16*2=32) and peek of next card (~24px)
    return Math.min(windowWidth - (Spacing.lg * 2 + 20), 380);
  }, [windowWidth]);

  const itemTotalLength = cardWidth + cardGap;

  // Auto-scroll loop
  useEffect(() => {
    if (isInteracting || featuredSites.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % featuredSites.length;
      try {
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      } catch {
        // Fallback for unmeasured index
      }
    }, autoScrollIntervalMs);

    return () => clearInterval(timer);
  }, [activeIndex, isInteracting, featuredSites.length, autoScrollIntervalMs]);

  // Handle scroll offset to track active index
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / itemTotalLength);
      if (index >= 0 && index < featuredSites.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    },
    [itemTotalLength, featuredSites.length, activeIndex]
  );

  if (!featuredSites || featuredSites.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Sub-header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>
            {t('home.heroTitle', "Explore India's Stories")}
          </Text>
        </View>
        <Text style={styles.siteCountText}>
          {activeIndex + 1} / {featuredSites.length}
        </Text>
      </View>

      {/* Horizontal Carousel FlatList */}
      <FlatList
        ref={flatListRef}
        data={featuredSites}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemTotalLength}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={styles.listContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setIsInteracting(true)}
        onScrollEndDrag={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
        onMomentumScrollEnd={() => setIsInteracting(false)}
        getItemLayout={(_, index) => ({
          length: itemTotalLength,
          offset: itemTotalLength * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 100);
        }}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <HeritageCard site={item} cardWidth={cardWidth} />
        )}
      />

      {/* Pagination Indicator */}
      <CarouselPagination
        total={featuredSites.length}
        activeIndex={activeIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm + 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accentBar: {
    width: 3,
    height: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  siteCountText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textTertiary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
