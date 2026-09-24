// SAARTHI — 360° Virtual Tour HUD & Overlay Controls
// Top Bar controls, Onboarding hints, Collapsible Bottom Info Panel & Hotspot Cards

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { VirtualTourSiteConfig, VirtualTourHotspot } from '../../types/virtualTour';
import { Colors } from '../../constants/colors';

interface VirtualTourHUDProps {
  site: VirtualTourSiteConfig;
  language: 'en' | 'hi';
  isPlayingAudio: boolean;
  isFullscreen: boolean;
  showOnboardingHint: boolean;
  selectedHotspot: VirtualTourHotspot | null;
  onBack: () => void;
  onToggleAudio: () => void;
  onToggleLanguage: () => void;
  onToggleFullscreen: () => void;
  onResetView: () => void;
  onSelectHotspot: (hotspot: VirtualTourHotspot | null) => void;
  onPlayHotspotAudio?: (hotspot: VirtualTourHotspot) => void;
}

export const VirtualTourHUD: React.FC<VirtualTourHUDProps> = ({
  site,
  language,
  isPlayingAudio,
  isFullscreen,
  showOnboardingHint,
  selectedHotspot,
  onBack,
  onToggleAudio,
  onToggleLanguage,
  onToggleFullscreen,
  onResetView,
  onSelectHotspot,
  onPlayHotspotAudio,
}) => {
  const insets = useSafeAreaInsets();
  const [isBottomPanelExpanded, setIsBottomPanelExpanded] = useState(false);

  const topOffset = insets.top > 0 ? insets.top + 10 : 16;
  const bottomOffset = insets.bottom > 0 ? insets.bottom + 12 : 20;

  const siteName = site.siteName[language] || site.siteName.en;
  const city = site.city[language] || site.city.en;
  const country = site.country[language] || site.country.en;
  const historicalPeriod = site.historicalPeriod[language] || site.historicalPeriod.en;
  const architecturalStyle = site.architecturalStyle[language] || site.architecturalStyle.en;
  const significance = site.significance[language] || site.significance.en;

  return (
    <View style={styles.hudContainer} pointerEvents="box-none">
      {/* 1. TOP BAR */}
      <View style={[styles.topBar, { top: topOffset }]} pointerEvents="box-none">
        {/* Top-Left: Back & Monument Identification */}
        <View style={styles.topBarLeft}>
          <TouchableOpacity
            style={styles.controlCircleBtn}
            onPress={onBack}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={language === 'hi' ? 'पीछे जाएं' : 'Go back to site details'}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.siteInfoBox}>
            <View style={styles.siteHeaderRow}>
              <Text style={styles.siteTitle} numberOfLines={1}>
                {siteName.toUpperCase()}
              </Text>
              {site.unesco && (
                <View style={styles.unescoPill}>
                  <Ionicons name="ribbon-sharp" size={10} color="#F59E0B" />
                  <Text style={styles.unescoPillText}>UNESCO</Text>
                </View>
              )}
            </View>
            <Text style={styles.siteSubtitle}>
              {city}, {country}
            </Text>
          </View>
        </View>

        {/* Top-Right: Experience Controls */}
        <View style={styles.topBarRight}>
          {/* Audio Narration Toggle */}
          <TouchableOpacity
            style={[styles.controlCircleBtn, isPlayingAudio && styles.activeControlBtn]}
            onPress={onToggleAudio}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={isPlayingAudio ? 'Pause Audio' : 'Play Audio Narration'}
          >
            <Ionicons
              name={isPlayingAudio ? 'volume-high' : 'volume-mute-outline'}
              size={19}
              color={isPlayingAudio ? '#F59E0B' : '#FFFFFF'}
            />
          </TouchableOpacity>

          {/* Language Toggle (EN / HI) */}
          <TouchableOpacity
            style={styles.langToggleBtn}
            onPress={onToggleLanguage}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={`Current language ${language.toUpperCase()}. Tap to switch.`}
          >
            <Ionicons name="globe-outline" size={15} color="#FFFFFF" />
            <Text style={styles.langToggleText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Fullscreen Toggle */}
          <TouchableOpacity
            style={styles.controlCircleBtn}
            onPress={onToggleFullscreen}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            <Ionicons
              name={isFullscreen ? 'contract-outline' : 'expand-outline'}
              size={19}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Reset / Recenter View */}
          <TouchableOpacity
            style={styles.controlCircleBtn}
            onPress={onResetView}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel="Recenter Virtual Tour View"
          >
            <Ionicons name="refresh-outline" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. ONBOARDING HINT OVERLAY (Automatically fades out) */}
      {showOnboardingHint && (
        <View style={styles.hintContainer} pointerEvents="none">
          <View style={styles.hintBubble}>
            <Ionicons name="finger-print-outline" size={18} color="#F59E0B" />
            <View style={styles.hintTextCol}>
              <Text style={styles.hintTitle}>
                {language === 'hi' ? 'देखने के लिए ड्रैग करें' : 'Drag to explore'}
              </Text>
              <Text style={styles.hintSub}>
                {language === 'hi'
                  ? 'पिंच या माउस व्हील से ज़ूम करें'
                  : 'Pinch or scroll to zoom'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 3. SELECTED HOTSPOT DETAILS CARD */}
      {selectedHotspot && (
        <View style={styles.hotspotCardContainer} pointerEvents="box-none">
          <View style={styles.hotspotCard}>
            {/* Card Header */}
            <View style={styles.hotspotCardHeader}>
              <View style={styles.hotspotBadgeRow}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>
                    {selectedHotspot.category.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.verifiedPill}>
                  <Ionicons name="shield-checkmark" size={11} color="#10B981" />
                  <Text style={styles.verifiedPillText}>
                    {language === 'hi' ? 'सत्यापित तथ्य' : 'VERIFIED'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => onSelectHotspot(null)}
                style={styles.cardCloseBtn}
                accessibilityRole="button"
                accessibilityLabel="Close hotspot card"
              >
                <Ionicons name="close" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.hotspotCardTitle}>
              {selectedHotspot.title[language] || selectedHotspot.title.en}
            </Text>
            {selectedHotspot.subtitle && (
              <Text style={styles.hotspotCardSubtitle}>
                {selectedHotspot.subtitle[language] || selectedHotspot.subtitle.en}
              </Text>
            )}

            <ScrollView
              style={styles.hotspotScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {/* Historical Description */}
              <Text style={styles.hotspotDescription}>
                {selectedHotspot.description[language] || selectedHotspot.description.en}
              </Text>

              {/* Architectural Info Box */}
              <View style={styles.infoSubBlock}>
                <View style={styles.infoSubHeader}>
                  <Ionicons name="business" size={14} color="#F59E0B" />
                  <Text style={styles.infoSubTitle}>
                    {language === 'hi' ? 'स्थापत्य विशेषताएं' : 'Architectural Information'}
                  </Text>
                </View>
                <Text style={styles.infoSubBody}>
                  {selectedHotspot.architecturalInfo[language] ||
                    selectedHotspot.architecturalInfo.en}
                </Text>
              </View>

              {/* Interesting Fact Box */}
              <View style={[styles.infoSubBlock, styles.factBlock]}>
                <View style={styles.infoSubHeader}>
                  <Ionicons name="bulb-outline" size={14} color="#3B82F6" />
                  <Text style={[styles.infoSubTitle, { color: '#60A5FA' }]}>
                    {language === 'hi' ? 'रोचक तथ्य' : 'Did You Know?'}
                  </Text>
                </View>
                <Text style={styles.infoSubBody}>
                  {selectedHotspot.interestingFact[language] ||
                    selectedHotspot.interestingFact.en}
                </Text>
              </View>

              {/* Provenance Footnote */}
              <View style={styles.provenanceRow}>
                <Ionicons name="library-outline" size={12} color="#9CA3AF" />
                <Text style={styles.provenanceText} numberOfLines={1}>
                  {selectedHotspot.provenance}
                </Text>
              </View>
            </ScrollView>

            {/* Hotspot Actions Footer */}
            <View style={styles.hotspotFooter}>
              <TouchableOpacity
                style={styles.hotspotAudioBtn}
                onPress={() => onPlayHotspotAudio?.(selectedHotspot)}
                activeOpacity={0.8}
              >
                <Ionicons name="headset" size={14} color="#F59E0B" />
                <Text style={styles.hotspotAudioBtnText}>
                  {language === 'hi' ? 'ऑडियो सुनें' : 'Listen to Narration'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 4. COLLAPSIBLE BOTTOM INFORMATION PANEL */}
      <View
        style={[
          styles.bottomPanelContainer,
          { bottom: bottomOffset },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.glassBottomCard}>
          {/* Header row with toggle */}
          <TouchableOpacity
            style={styles.bottomCardHeader}
            onPress={() => setIsBottomPanelExpanded(!isBottomPanelExpanded)}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Toggle site information panel"
          >
            <View style={styles.bottomHeaderLeft}>
              <View style={styles.monumentIndicatorDot} />
              <Text style={styles.bottomMonumentTitle}>{siteName}</Text>
              <Text style={styles.bottomLocationText}>• {city}</Text>
            </View>

            <View style={styles.exploreDetailsBadge}>
              <Text style={styles.exploreDetailsText}>
                {isBottomPanelExpanded
                  ? language === 'hi'
                    ? 'संक्षिप्त करें'
                    : 'Hide Details'
                  : language === 'hi'
                  ? 'विवरण देखें'
                  : 'Explore Details'}
              </Text>
              <Ionicons
                name={isBottomPanelExpanded ? 'chevron-down' : 'chevron-up'}
                size={15}
                color="#F59E0B"
              />
            </View>
          </TouchableOpacity>

          {/* Key Facts Quick Grid */}
          <View style={styles.keyFactsGrid}>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>
                {language === 'hi' ? 'ऐतिहासिक काल' : 'Historical Period'}
              </Text>
              <Text style={styles.factValue} numberOfLines={1}>
                {historicalPeriod}
              </Text>
            </View>

            <View style={styles.factDivider} />

            <View style={styles.factItem}>
              <Text style={styles.factLabel}>
                {language === 'hi' ? 'वास्तुकला' : 'Architecture'}
              </Text>
              <Text style={styles.factValue} numberOfLines={1}>
                {architecturalStyle}
              </Text>
            </View>

            <View style={styles.factDivider} />

            <View style={styles.factItem}>
              <Text style={styles.factLabel}>
                {language === 'hi' ? 'महत्व' : 'Significance'}
              </Text>
              <Text style={styles.factValue} numberOfLines={1}>
                {significance}
              </Text>
            </View>
          </View>

          {/* Expanded Narrative Section */}
          {isBottomPanelExpanded && (
            <View style={styles.expandedContentBlock}>
              <View style={styles.expandedDivider} />
              <Text style={styles.expandedOverviewTitle}>
                {language === 'hi' ? 'स्मारक का संक्षिप्त इतिहास' : 'Monument Architectural Context'}
              </Text>
              <Text style={styles.expandedOverviewDesc}>
                {language === 'hi'
                  ? 'कुतुब मीनार परिसर भारत में सल्तनत वास्तुकला का सबसे महत्वपूर्ण प्रारंभिक केंद्र है। 72.5 मीटर ऊंची विजय मीनार, गुप्तकालीन लौह स्तंभ, कुव्वत-उल-इस्लाम मस्जिद के नक्काशीदार दालान और अलाई दरवाजा भारत की समृद्ध ऐतिहासिक एवं स्थापत्य विरासत को एक साथ प्रदर्शित करते हैं।'
                  : 'The Qutub Minar complex stands as the seminal monument of early Indo-Islamic architecture in India. Incorporating the 72.5m victory minaret, the 4th-century rustless Gupta Iron Pillar, Quwwat-ul-Islam colonnades, and Alai Darwaza with India’s first true dome, it preserves centuries of architectural evolution under UNESCO protection.'}
              </Text>

              <View style={styles.bottomVerificationFooter}>
                <Ionicons name="shield-checkmark" size={13} color="#10B981" />
                <Text style={styles.bottomVerificationText}>
                  {language === 'hi'
                    ? `सत्यापित स्रोत: ${site.provenance.source}`
                    : `Verified: ${site.provenance.source}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hudContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 200,
  },

  // Top Bar
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 210,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '55%',
  },
  controlCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  activeControlBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderColor: '#F59E0B',
  },
  siteInfoBox: {
    marginLeft: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  siteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  siteTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  unescoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  unescoPillText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 2,
  },
  siteSubtitle: {
    color: '#D1D5DB',
    fontSize: 11,
    marginTop: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    height: 42,
    borderRadius: 21,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  langToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Onboarding Hint
  hintContainer: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 180,
  },
  hintBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    gap: 10,
  },
  hintTextCol: {
    alignItems: 'flex-start',
  },
  hintTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  hintSub: {
    color: '#D1D5DB',
    fontSize: 11,
  },

  // Selected Hotspot Card
  hotspotCardContainer: {
    position: 'absolute',
    top: 90,
    right: 16,
    bottom: 120,
    width: Math.min(380, Platform.OS === 'web' ? 380 : 320),
    zIndex: 220,
    justifyContent: 'center',
  },
  hotspotCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 16,
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 12,
  },
  hotspotCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hotspotBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  categoryPillText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  verifiedPillText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  cardCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotspotCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  hotspotCardSubtitle: {
    color: '#F59E0B',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  hotspotScroll: {
    maxHeight: 280,
  },
  hotspotDescription: {
    color: '#E5E7EB',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  infoSubBlock: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  factBlock: {
    borderLeftColor: '#3B82F6',
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
  },
  infoSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoSubTitle: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  infoSubBody: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 17,
  },
  provenanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  provenanceText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontStyle: 'italic',
    flex: 1,
  },
  hotspotFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  hotspotAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  hotspotAudioBtnText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },

  // Collapsible Bottom Info Panel
  bottomPanelContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 210,
    alignItems: 'center',
  },
  glassBottomCard: {
    width: '100%',
    maxWidth: 680,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  bottomHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monumentIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  bottomMonumentTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomLocationText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },
  exploreDetailsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  exploreDetailsText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },
  keyFactsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  factItem: {
    flex: 1,
    paddingHorizontal: 4,
  },
  factDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  factLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  factValue: {
    color: '#F3F4F6',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  expandedContentBlock: {
    marginTop: 10,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  expandedOverviewTitle: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  expandedOverviewDesc: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  bottomVerificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomVerificationText: {
    color: '#10B981',
    fontSize: 11,
  },
});
