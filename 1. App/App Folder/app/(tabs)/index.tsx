// SAARTHI — Home Screen
// Implements PRD §11 & TRD §8: Common Header, Personalized Greeting, Hero Heritage Carousel,
// Places Near You, Quick Actions, Recommendations & Popular Sites

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { heritageSites, getSiteById } from '../../data/sites';
import { CommonHeader } from '../../components/common/CommonHeader';
import { HeritageCarousel } from '../../components/heritage/HeritageCarousel';
import { NearbyPlacesSection } from '../../components/location/NearbyPlacesSection';
import { ManualLocationModal } from '../../components/location/ManualLocationModal';
import { SiteCard } from '../../components/heritage/SiteCard';
import { useUserStore } from '../../store/userStore';
import { useLocationStore } from '../../store/locationStore';
import { locationService } from '../../services/location/locationService';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useUserStore((s) => s.profile);
  const isLargeText = user?.accessibility?.largeText;

  const [currentLocationName, setCurrentLocationName] = React.useState<string>('Nagpur & Vidarbha');
  const [isManualModalVisible, setIsManualModalVisible] = React.useState(false);

  // Quick Action navigation handlers
  const quickActions = [
    {
      id: 'nearby',
      label: t('home.exploreNearby', 'Explore Nearby'),
      icon: 'navigate-outline' as const,
      color: Colors.primary,
      onPress: async () => {
        try {
          const status = await locationService.checkLocationPermission();
          if (status !== 'granted') {
            const req = await locationService.requestLocationPermission();
            if (req === 'granted') {
              await locationService.getCurrentLocation();
            }
          } else {
            await locationService.getCurrentLocation();
          }
        } catch {
          // Proceed to explore
        }
        router.push('/explore?nearby=true');
      },
    },
    {
      id: 'plan',
      label: t('home.planMyVisit', 'Plan My Visit'),
      icon: 'calendar-outline' as const,
      color: Colors.secondary,
      onPress: () => router.push('/planner'),
    },
    {
      id: 'guide',
      label: t('home.aiGuide', 'AI Guide'),
      icon: 'chatbubbles-outline' as const,
      color: '#2A9D8F',
      onPress: () => router.push('/guide'),
    },
    {
      id: 'offline',
      label: t('home.downloadSite', 'Downloads'),
      icon: 'cloud-download-outline' as const,
      color: Colors.accent,
      onPress: () => router.push('/profile'),
    },
  ];

  // Recently viewed sites
  const recentSites = (user?.recentlyViewed || [])
    .map((id) => getSiteById(id))
    .filter(Boolean) as typeof heritageSites;

  const currentCoords = useLocationStore((s) => s.currentCoordinates);

  // Proximity-aware recommended sites: features India Gate along with proximity-sorted monuments!
  // Sanchi Stupa and Khajuraho are replaced with other monuments per user request
  const recommendedSites = React.useMemo(() => {
    const indiaGate = getSiteById('india-gate');
    const baseSites = heritageSites.filter(
      (s) => s.id !== 'india-gate' && s.id !== 'sanchi-stupa' && s.id !== 'khajuraho'
    );
    if (!currentCoords) {
      return indiaGate ? [indiaGate, ...baseSites.slice(0, 2)] : baseSites.slice(0, 3);
    }
    const sorted = [...baseSites].sort((a, b) => {
      const distA = locationService.calculateDistanceKm(currentCoords, a.coordinates);
      const distB = locationService.calculateDistanceKm(currentCoords, b.coordinates);
      return distA - distB;
    });
    return indiaGate ? [indiaGate, ...sorted.slice(0, 2)] : sorted.slice(0, 3);
  }, [currentCoords]);

  // Resolve current area name whenever coordinates update
  React.useEffect(() => {
    if (currentCoords) {
      locationService.getApproximateAreaName(currentCoords).then((name) => {
        if (name) setCurrentLocationName(name);
      });
    } else {
      setCurrentLocationName('Nagpur & Vidarbha');
    }
  }, [currentCoords]);

  return (
    <View style={styles.container}>
      {/* Top Reusable Common Header with Official Logo and Profile navigation */}
      <CommonHeader title="SAARTHI" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Polished Horizontal Auto-Scrolling Heritage Carousel */}
        <HeritageCarousel />

        {/* Dedicated Location-Based 'Places Near You' Section */}
        <NearbyPlacesSection />

        {/* 360° AR Experience Spotlight Banner */}
        <View style={styles.paddedSection}>
          <TouchableOpacity
            style={styles.vrSpotlightBanner}
            onPress={() => router.push('/site/deekshabhoomi/experience' as any)}
            activeOpacity={0.88}
          >
            <View style={styles.vrSpotlightLeft}>
              <View style={styles.vrSpotlightPill}>
                <Ionicons name="sparkles" size={11} color="#D97706" />
                <Text style={styles.vrSpotlightPillText}>FEATURED 360° AR TOUR</Text>
              </View>
              <Text style={styles.vrSpotlightHeading}>Step Inside Deekshabhoomi</Text>
              <Text style={styles.vrSpotlightSub}>
                Touch-pan panoramic views, explore the dome, and inspect sacred relics.
              </Text>
            </View>
            <View style={styles.vrSpotlightBtn}>
              <Ionicons name="scan-outline" size={13} color="#1A1815" />
              <Text style={styles.vrSpotlightBtnText}>VIEW IN AR</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Action 4-Grid */}
        <View style={styles.paddedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('home.quickActions', 'Quick Actions')}
            </Text>
          </View>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <View
                  style={[
                    styles.actionIconCircle,
                    { backgroundColor: `${action.color}15` },
                  ]}
                >
                  <Ionicons name={action.icon} size={22} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recommended for You (Based on User Interests & Location Proximity) */}
        <View style={styles.paddedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('home.recommendedForYou', 'Recommended for You')}
            </Text>
          </View>
          <View style={styles.sitesList}>
            {recommendedSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </View>
        </View>

        {/* Continue Exploring (Recent) if any */}
        {recentSites.length > 0 && (
          <View style={styles.paddedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('home.continueExploring', 'Continue Exploring')}
              </Text>
            </View>
            <View style={styles.sitesList}>
              {recentSites.slice(0, 2).map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </View>
          </View>
        )}

        {/* Popular Heritage Sites */}
        <View style={styles.paddedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('home.popularSites', 'Popular Heritage Sites')}
            </Text>
          </View>
          <View style={styles.sitesList}>
            {heritageSites
              .filter((s) => s.id !== 'sanchi-stupa' && s.id !== 'khajuraho')
              .slice(1, 6)
              .map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal to pick or switch location */}
      <ManualLocationModal
        visible={isManualModalVisible}
        onClose={() => setIsManualModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: 110, // Space above floating audio bar and bottom tab bar
  },
  paddedSection: {
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  actionLabel: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  sitesList: {
    marginBottom: Spacing.md,
  },
  vrSpotlightBanner: {
    backgroundColor: '#1E1B18',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md + 2,
    borderWidth: 1.5,
    borderColor: 'rgba(217, 119, 6, 0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  vrSpotlightLeft: {
    flex: 1,
    paddingRight: Spacing.md,
    gap: 4,
  },
  vrSpotlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  vrSpotlightPillText: {
    color: '#F59E0B',
    fontSize: 9.5,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  vrSpotlightHeading: {
    color: '#FFFDF9',
    fontSize: 16,
    fontFamily: Typography.fonts.serifSemiBold,
    marginTop: 2,
  },
  vrSpotlightSub: {
    color: '#D1D5DB',
    fontSize: 11.5,
    fontFamily: Typography.fonts.sans,
    lineHeight: 16,
  },
  vrSpotlightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  vrSpotlightBtnText: {
    color: '#1A1815',
    fontSize: 11.5,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.4,
  },
});
