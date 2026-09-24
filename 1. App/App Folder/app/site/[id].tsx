// SAARTHI — Heritage Site Detail Screen
// Implements PRD §14, §17 & TRD §8: 10 structured sections, Provenance, Audio narration, and Offline Maps

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { getSiteById } from '../../data/sites';
import { getStoriesBySiteId } from '../../data/stories';
import { GradientPlaceholder } from '../../components/common/GradientPlaceholder';
import { Badge } from '../../components/common/Badge';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { StoryCard } from '../../components/heritage/StoryCard';
import { FacilityList } from '../../components/heritage/FacilityList';
import { AccessibilityInfo } from '../../components/heritage/AccessibilityInfo';
import { TimelineView } from '../../components/heritage/TimelineView';
import { SiteMapSchematic } from '../../components/heritage/SiteMapSchematic';
import { Button } from '../../components/common/Button';
import { useUserStore } from '../../store/userStore';
import { useOfflineStore } from '../../store/offlineStore';
import { useAudioStore } from '../../store/audioStore';
import { weatherService } from '../../services/weather/weatherService';
import { crowdService, CrowdStatus } from '../../services/crowd/crowdService';
import type { WeatherInfo } from '../../types/services';
import { resolveImageSource } from '../../utils/image';

export default function SiteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 14 : 10);

  const site = getSiteById(id || 'qutub-minar');
  const stories = getStoriesBySiteId(id || 'qutub-minar');

  const isSaved = useUserStore((s) => s.profile.savedSites.includes(site?.id || ''));
  const toggleSavedSite = useUserStore((s) => s.toggleSavedSite);
  const addRecentlyViewed = useUserStore((s) => s.addRecentlyViewed);
  const incrementSitesExplored = useUserStore((s) => s.incrementSitesExplored);

  const isDownloaded = useOfflineStore((s) => s.isSiteDownloaded(site?.id || ''));
  const downloadSite = useOfflineStore((s) => s.downloadSite);
  const playTrack = useAudioStore((s) => s.playTrack);

  const [activeSection, setActiveSection] = useState<'overview' | 'stories' | 'map' | 'facilities'>('overview');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [crowd, setCrowd] = useState<CrowdStatus | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (site) {
      addRecentlyViewed(site.id);
      incrementSitesExplored();
      weatherService.getWeather(site.id).then(setWeather);
      crowdService.getStatus(site.id).then(setCrowd);
    }
  }, [site?.id]);

  if (!site) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorTitle}>Heritage Site Not Found</Text>
        <Button
          title="Return to Explore"
          onPress={() => router.replace('/explore')}
          style={{ marginTop: Spacing.md }}
        />
      </View>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    await downloadSite(site.id);
    setDownloading(false);
    Alert.alert('Download Complete', `${site.name} is now available offline.`);
  };

  const handleStartExploring = () => {
    // Start first audio guide story
    if (stories.length > 0 && stories[0].audioAvailable && stories[0].audioId) {
      playTrack({
        id: stories[0].audioId,
        storyId: stories[0].id,
        siteId: site.id,
        title: stories[0].title,
        duration: stories[0].readTime * 60,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Top Bar with notch safe insets */}
      <View style={[styles.topBar, { top: insets.top > 0 ? insets.top + 8 : 12 }]}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => toggleSavedSite(site.id)}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? 'Remove saved' : 'Save site'}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isSaved ? Colors.primary : Colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={handleDownload}
            disabled={downloading || isDownloaded}
            accessibilityRole="button"
            accessibilityLabel="Download site pack"
          >
            <Ionicons
              name={isDownloaded ? 'checkmark-circle' : 'cloud-download-outline'}
              size={20}
              color={isDownloaded ? Colors.success : Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Visual Header */}
        <View style={styles.heroImageContainer}>
          {site.images && site.images.length > 0 && !imageError ? (
            <>
              <Image
                source={resolveImageSource(site.images[0])}
                style={styles.heroImage}
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              )}
              <View style={styles.heroOverlayGradient} />
            </>
          ) : (
            <GradientPlaceholder
              title={site.name}
              category={site.heritageType}
              height={240}
              borderRadius={0}
              unesco={site.unesco}
            />
          )}
        </View>

        {/* Header Metadata Content */}
        <View style={styles.metaContainer}>
          <View style={styles.tagsRow}>
            <Badge label={site.heritageType} variant="primary" size="sm" />
            {site.unesco && (
              <Badge
                label={`UNESCO (${site.unescoYear})`}
                variant="warning"
                size="sm"
              />
            )}
            {site.asiProtected && (
              <Badge label="ASI PROTECTED" variant="info" size="sm" />
            )}
            {isDownloaded && (
              <Badge label="DOWNLOADED" variant="success" size="sm" />
            )}
          </View>

          <Text style={styles.title}>{site.name}</Text>
          <View style={styles.locRow}>
            <Ionicons name="location-sharp" size={15} color={Colors.primary} />
            <Text style={styles.locText}>
              {site.city}, {site.state}, {site.country}
            </Text>
          </View>

          {/* Real-time Status Card (Weather & Crowd) */}
          {(weather || crowd) && (
            <View style={styles.realtimeCard}>
              <View style={styles.realtimeItem}>
                <Ionicons name="sunny-outline" size={18} color={Colors.secondary} />
                <View>
                  <Text style={styles.realtimeVal}>{weather?.temperature}°C</Text>
                  <Text style={styles.realtimeSub}>{weather?.condition}</Text>
                </View>
              </View>
              <View style={styles.realtimeDivider} />
              <View style={styles.realtimeItem}>
                <Ionicons name="people-outline" size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.realtimeVal}>{crowd?.level} Footfall</Text>
                  <Text style={styles.realtimeSub}>
                    {crowd?.isOpen ? 'Site Open' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Augmented Reality Immersive Experience Entry Banner */}
          <TouchableOpacity
            style={styles.vrExperienceBanner}
            onPress={() => router.push(`/site/${site.id}/experience` as any)}
            activeOpacity={0.85}
          >
            <View style={styles.vrBannerLeft}>
              <View style={styles.vrBannerBadge}>
                <Ionicons name="cube-outline" size={13} color="#D97706" />
                <Text style={styles.vrBannerBadgeText}>IMMERSIVE AR EXPERIENCE</Text>
              </View>
              <Text style={styles.vrBannerTitle}>Explore in Augmented Reality</Text>
              <Text style={styles.vrBannerSubtitle}>
                Interactive 3D monument placement, architectural hotspots & camera AR
              </Text>
            </View>
            <View style={styles.vrBannerAction}>
              <View style={styles.vrBannerBtn}>
                <Text style={styles.vrBannerBtnText}>VIEW IN AR</Text>
                <Ionicons name="scan-outline" size={13} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Quick Jump Section Tabs */}
          <View style={styles.sectionTabs}>
            {[
              { id: 'overview' as const, label: 'Overview' },
              { id: 'stories' as const, label: `Stories (${stories.length})` },
              { id: 'map' as const, label: 'Map' },
              { id: 'facilities' as const, label: 'Amenities' },
            ].map((tabItem) => (
              <TouchableOpacity
                key={tabItem.id}
                style={[
                  styles.tabItem,
                  activeSection === tabItem.id && styles.tabItemActive,
                ]}
                onPress={() => setActiveSection(tabItem.id)}
              >
                <Text
                  style={[
                    styles.tabItemText,
                    activeSection === tabItem.id && styles.tabItemTextActive,
                  ]}
                >
                  {tabItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dynamic Section Contents */}
          {activeSection === 'overview' && (
            <View style={styles.sectionBody}>
              {/* Detailed Description */}
              <Text style={styles.sectionHeading}>About this Heritage Site</Text>
              <Text style={styles.bodyParagraph}>{site.description}</Text>

              {/* Provenance Metadata Info Box */}
              <View style={styles.provenanceBox}>
                <View style={styles.provenanceHeader}>
                  <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
                  <Text style={styles.provenanceTitle}>Knowledge Provenance</Text>
                </View>
                <Text style={styles.provenanceMeta}>
                  Documented by: {site.provenance.source}
                </Text>
                <Text style={styles.provenanceMeta}>
                  Verified by: {site.provenance.verifiedBy} • Updated: {site.provenance.lastUpdated}
                </Text>
                <View style={styles.provenanceChips}>
                  {site.provenance.labels.map((lbl, idx) => (
                    <ProvenanceBadge key={idx} label={lbl} size="sm" />
                  ))}
                </View>
              </View>

              {/* Visit Information Grid */}
              <Text style={styles.sectionHeading}>Visiting Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoGridItem}>
                  <Ionicons name="time-outline" size={16} color={Colors.primary} />
                  <Text style={styles.infoGridLabel}>Hours</Text>
                  <Text style={styles.infoGridVal}>{site.openingHours}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Ionicons name="cash-outline" size={16} color={Colors.primary} />
                  <Text style={styles.infoGridLabel}>Entry Fee</Text>
                  <Text style={styles.infoGridVal}>{site.entryFee}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                  <Text style={styles.infoGridLabel}>Best Season</Text>
                  <Text style={styles.infoGridVal}>{site.bestTimeToVisit}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Ionicons name="hourglass-outline" size={16} color={Colors.primary} />
                  <Text style={styles.infoGridLabel}>Est. Visit Time</Text>
                  <Text style={styles.infoGridVal}>{site.estimatedVisitTime}</Text>
                </View>
              </View>

              {/* Historical Timeline */}
              <Text style={styles.sectionHeading}>Historical Chronology</Text>
              <TimelineView timeline={site.timeline} />
            </View>
          )}

          {activeSection === 'stories' && (
            <View style={styles.sectionBody}>
              <Text style={styles.sectionHeading}>Verified Heritage Stories</Text>
              <Text style={styles.sectionSub}>
                Grounded historical contexts, architectural details, and verified legends.
              </Text>
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onPress={() => router.push(`/story/${story.id}`)}
                />
              ))}
            </View>
          )}

          {activeSection === 'map' && (
            <View style={styles.sectionBody}>
              <Text style={styles.sectionHeading}>Architectural Schematic Map</Text>
              <Text style={styles.sectionSub}>
                Interactive layout showing monument orientation, pathways, and amenities.
              </Text>
              <SiteMapSchematic site={site} />
            </View>
          )}

          {activeSection === 'facilities' && (
            <View style={styles.sectionBody}>
              <Text style={styles.sectionHeading}>On-Site Amenities</Text>
              <FacilityList facilities={site.facilities} />

              <Text style={[styles.sectionHeading, { marginTop: Spacing.xl }]}>
                Accessibility Information
              </Text>
              <AccessibilityInfo accessibility={site.accessibility} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Exploration Action with safe bottom clearance */}
      <View style={[styles.bottomBar, { paddingBottom: bottomInset + 8 }]}>
        <TouchableOpacity
          style={styles.vrBottomBtn}
          onPress={() => router.push(`/site/${site.id}/experience` as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="scan-outline" size={18} color="#D97706" />
          <Text style={styles.vrBottomBtnText}>View in AR</Text>
        </TouchableOpacity>
        <Button
          title={t('site.startExploring', 'AUDIO GUIDE')}
          onPress={handleStartExploring}
          size="lg"
          style={{ flex: 1 }}
          leftIcon={<Ionicons name="headset" size={18} color={Colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroImageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: Colors.surfaceVariant,
    position: 'relative',
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
  heroOverlayGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  metaContainer: {
    padding: Spacing.lg,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.scale.h1,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  realtimeCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  realtimeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  realtimeVal: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  realtimeSub: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
  },
  realtimeDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.sm,
  },
  sectionTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  tabItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabItemText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  tabItemTextActive: {
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  sectionBody: {
    paddingVertical: Spacing.xs,
  },
  sectionHeading: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionSub: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  bodyParagraph: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sans,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  provenanceBox: {
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  provenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  provenanceTitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  provenanceMeta: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  provenanceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  infoGridItem: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: '48%',
  },
  infoGridLabel: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textTertiary,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  infoGridVal: {
    fontSize: Typography.scale.caption + 1,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadows.lg,
  },
  vrBottomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  vrBottomBtnText: {
    color: '#92400E',
    fontFamily: Typography.fonts.sansBold,
    fontSize: Typography.scale.body,
  },
  vrExperienceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1917',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(217, 119, 6, 0.4)',
    padding: 14,
    marginVertical: Spacing.md,
    ...Shadows.md,
  },
  vrBannerLeft: {
    flex: 1,
    gap: 3,
    paddingRight: 10,
  },
  vrBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vrBannerBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  vrBannerTitle: {
    color: '#FFFDF9',
    fontSize: 15,
    fontFamily: Typography.fonts.serifSemiBold,
  },
  vrBannerSubtitle: {
    color: '#D6D3D1',
    fontSize: 11.5,
    fontFamily: Typography.fonts.sans,
    lineHeight: 16,
  },
  vrBannerAction: {
    justifyContent: 'center',
  },
  vrBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  vrBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  errorTitle: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
});
