// SAARTHI — Heritage Intro Screen (UI Reference Screen 1)
// Displays full-bleed heritage hero imagery, authentic Indian heritage statistics, and the primary "EXPLORE NOW →" CTA.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../constants/layout';

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const handleExploreNow = () => {
    router.replace('/explore');
  };

  const handleOpenExperience = () => {
    router.push('/site/deekshabhoomi/experience' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Hero Heritage Visual Background with Scrim */}
      <View style={styles.heroBackground}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1600&q=85',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.darkGradient} />
        <View style={styles.radialVignette} />
      </View>

      {/* Top Header Bar with SAARTHI Logo */}
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={styles.brandRow}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.brandLogo}
            resizeMode="cover"
          />
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>SAARTHI</Text>
            <Text style={styles.brandTagline}>HERITAGE COMPANION</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
          accessibilityLabel="Skip intro to Home"
        >
          <Text style={styles.skipBtnText}>Home</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Breathing Room */}
        <View style={{ height: 160 }} />

        {/* Heritage Category Tag */}
        <View style={styles.heritageTagPill}>
          <View style={styles.pulseDot} />
          <Text style={styles.heritageTagText}>EXPLORE INDIA’S TIMELESS WONDERS</Text>
        </View>

        {/* Hero Headline */}
        <Text style={styles.mainHeading}>
          Explore India’s{'\n'}Heritage Stories
        </Text>

        {/* Description */}
        <Text style={styles.subHeading}>
          Step into centuries of living history, monumental architecture, and sacred sanctuaries across India’s most revered heritage landmarks.
        </Text>

        {/* Live Heritage Statistics Grid */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>UNESCO</Text>
            <Text style={styles.statSub}>World Sites</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3,690+</Text>
            <Text style={styles.statLabel}>ASI PROTECTED</Text>
            <Text style={styles.statSub}>Monuments</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10,000+</Text>
            <Text style={styles.statLabel}>YEARS</Text>
            <Text style={styles.statSub}>Civilization</Text>
          </View>
        </View>

        {/* Primary CTA Button */}
        <TouchableOpacity
          style={styles.primaryCta}
          onPress={handleExploreNow}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Explore Now"
        >
          <Text style={styles.primaryCtaText}>EXPLORE NOW</Text>
          <View style={styles.ctaArrowCircle}>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Secondary 360° AR Quick Discovery Trigger */}
        <TouchableOpacity
          style={styles.secondaryTrigger}
          onPress={handleOpenExperience}
          activeOpacity={0.82}
        >
          <Ionicons name="scan-outline" size={16} color={Colors.secondary} />
          <Text style={styles.secondaryTriggerText}>
            Try Immersive Augmented Reality Mode
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1318',
  },
  heroBackground: {
    ...StyleSheet.absoluteFill,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  darkGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 19, 24, 0.65)',
  },
  radialVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    borderBottomWidth: 500,
    borderBottomColor: 'rgba(15, 19, 24, 0.95)',
  },
  topHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
    letterSpacing: 2,
  },
  brandTagline: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.secondary,
    letterSpacing: 1.5,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  skipBtnText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  heritageTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(196, 150, 60, 0.25)',
    borderColor: 'rgba(196, 150, 60, 0.5)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
    gap: 6,
    marginBottom: Spacing.md,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  heritageTagText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.secondary,
    letterSpacing: 1,
  },
  mainHeading: {
    fontSize: 38,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.white,
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  subHeading: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sans,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xl,
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.secondary,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  statSub: {
    fontSize: 10,
    fontFamily: Typography.fonts.sans,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.md,
    borderRadius: BorderRadius.round,
    ...Shadows.lg,
    marginBottom: Spacing.md,
  },
  primaryCtaText: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
    letterSpacing: 1.5,
  },
  ctaArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  secondaryTriggerText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
