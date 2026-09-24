import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { heritageExperienceService } from '../../../services/experience/heritageExperienceService';
import { ImmersiveCanvas, ImmersiveCanvasRef } from '../../../components/experience/ImmersiveCanvas';
import { HeritageExperience, HeritageScene, ExperienceHotspot } from '../../../types/experience';
import { useAudioStore } from '../../../store/audioStore';
import { virtualTourRegistry } from '../../../data/heritage/virtualToursRegistry';
import { VirtualTourViewer } from '../../../components/virtual-tour';
import { ARViewer } from '../../../components/ar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SiteExperienceScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();

  // If site is India Gate or explicitly launched in AR mode, render the WebAR camera surface viewer
  if (id === 'india-gate' || mode === 'ar') {
    return <ARViewer siteId={id || 'india-gate'} />;
  }

  // If site has a full Three.js 360 virtual tour configured, render the immersive 360 viewer
  if (id && virtualTourRegistry.hasVirtualTour(id)) {
    return <VirtualTourViewer siteId={id} />;
  }

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const canvasRef = useRef<ImmersiveCanvasRef>(null);

  // Audio store hooks
  const playTrack = useAudioStore((s) => s.playTrack);
  const pauseAudio = useAudioStore((s) => s.pause);
  const playbackState = useAudioStore((s) => s.playbackState);
  const currentTrack = useAudioStore((s) => s.currentTrack);

  const [experience, setExperience] = useState<HeritageExperience | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<ExperienceHotspot | null>(null);
  const [isInfoCardCollapsed, setIsInfoCardCollapsed] = useState(false);
  const [showViewpointModal, setShowViewpointModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  useEffect(() => {
    if (id) {
      heritageExperienceService.getExperienceBySiteId(id).then((exp) => {
        setExperience(exp);
        setCurrentSceneIndex(0);
        setSelectedHotspot(null);
      });
    }
  }, [id]);

  if (!experience || experience.scenes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <Ionicons name="compass-outline" size={48} color="#F59E0B" />
        <Text style={styles.loadingText}>Loading AR Experience...</Text>
        <TouchableOpacity style={styles.backBtnFallback} onPress={() => router.back()}>
          <Text style={styles.backBtnFallbackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentScene: HeritageScene = experience.scenes[currentSceneIndex] || experience.scenes[0];
  const isPlayingThisScene =
    playbackState === 'playing' && currentTrack?.id === currentScene.id;

  const handleToggleAudio = () => {
    if (isPlayingThisScene) {
      pauseAudio();
    } else {
      playTrack({
        id: currentScene.id,
        siteId: experience.siteId,
        title: `${experience.siteName} — ${currentScene.title}`,
        duration: 180,
      });
    }
  };

  const handleSelectHotspot = (hotspot: ExperienceHotspot) => {
    setSelectedHotspot(hotspot);
    // Auto pan canvas towards the hotspot for optimal focus
    canvasRef.current?.panTo(hotspot.position.x, hotspot.position.y);
  };

  const handleSwitchScene = (index: number) => {
    setCurrentSceneIndex(index);
    setSelectedHotspot(null);
    setShowViewpointModal(false);
    canvasRef.current?.resetCenter();
  };

  const handleAskAIGuide = (queryTopic?: string) => {
    // Navigate to AI Guide with context
    router.push({
      pathname: '/(tabs)/guide',
      params: {
        siteId: experience.siteId,
        inquiry: queryTopic
          ? `Tell me more about ${queryTopic} at ${experience.siteName}`
          : `Explain the architecture of ${experience.siteName}`,
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Interactive 360 Panoramic Drag Canvas */}
      <ImmersiveCanvas
        ref={canvasRef}
        scene={currentScene}
        onSelectHotspot={handleSelectHotspot}
        selectedHotspotId={selectedHotspot?.id}
      />

      {/* Top Floating Bar */}
      <View style={[styles.topBar, { top: insets.top > 0 ? insets.top + 8 : 16 }]}>
        {/* Back / Close button */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close 360 Experience"
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Center Title Pill */}
        <View style={styles.titlePill}>
          <Text style={styles.titlePillHeading} numberOfLines={1}>
            {experience.siteName}
          </Text>
          <View style={styles.titlePillSubRow}>
            <View style={styles.liveIndicator} />
            <Text style={styles.titlePillSub} numberOfLines={1}>
              {currentScene.title} • {experience.city}
            </Text>
          </View>
        </View>

        {/* More / Menu Button */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => setShowMenuModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Experience Details"
          activeOpacity={0.8}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Apollo Belvedere-style Heritage Info Card Overlay */}
      <View
        style={[
          styles.heritageInfoOverlay,
          { top: insets.top > 0 ? insets.top + 70 : 76 },
        ]}
      >
        <View style={styles.heritageCard}>
          {/* Card Header & Collapse Toggle */}
          <TouchableOpacity
            style={styles.heritageCardHeader}
            onPress={() => setIsInfoCardCollapsed(!isInfoCardCollapsed)}
            activeOpacity={0.85}
          >
            <View style={styles.heritageCardBadgeRow}>
              <View style={styles.vrBadge}>
                <Ionicons name="scan-outline" size={12} color="#D97706" />
                <Text style={styles.vrBadgeText}>
                  360° AR • {currentScene.viewpointType.toUpperCase()}
                </Text>
              </View>
              <Ionicons
                name={isInfoCardCollapsed ? 'chevron-down' : 'chevron-up'}
                size={18}
                color="#A8A29E"
              />
            </View>

            <Text style={styles.heritageCardTitle} numberOfLines={1}>
              {currentScene.title}
            </Text>
            <Text style={styles.heritageCardSubtitle} numberOfLines={1}>
              {experience.historicalPeriod}
            </Text>
          </TouchableOpacity>

          {/* Collapsible Narrative Body */}
          {!isInfoCardCollapsed && (
            <View style={styles.heritageCardBody}>
              <Text style={styles.heritageCardDesc} numberOfLines={3}>
                {currentScene.description}
              </Text>

              {/* Provenance Verification Footer */}
              <View style={styles.provenanceFooter}>
                <Ionicons name="shield-checkmark" size={13} color="#10B981" />
                <Text style={styles.provenanceText} numberOfLines={1}>
                  Verified: {experience.provenance.source}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Selected Hotspot Detail Card (slides up when a hotspot is tapped) */}
      {selectedHotspot && (
        <View style={styles.hotspotOverlay}>
          <View style={styles.hotspotCard}>
            <View style={styles.hotspotHeader}>
              <View style={styles.hotspotCategoryBadge}>
                <Text style={styles.hotspotCategoryText}>
                  {selectedHotspot.category.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedHotspot(null)}
                style={styles.hotspotCloseBtn}
              >
                <Ionicons name="close" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            </View>

            <Text style={styles.hotspotTitle}>{selectedHotspot.title}</Text>
            {selectedHotspot.subtitle && (
              <Text style={styles.hotspotSubtitle}>{selectedHotspot.subtitle}</Text>
            )}

            <Text style={styles.hotspotDescription}>
              {selectedHotspot.description}
            </Text>

            {selectedHotspot.provenance && (
              <Text style={styles.hotspotProvenance}>
                Source: {selectedHotspot.provenance}
              </Text>
            )}

            {/* Hotspot Actions */}
            <View style={styles.hotspotActionsRow}>
              <TouchableOpacity
                style={styles.hotspotPrimaryBtn}
                onPress={() => handleAskAIGuide(selectedHotspot.title)}
                activeOpacity={0.85}
              >
                <Ionicons name="sparkles" size={15} color="#1A1815" />
                <Text style={styles.hotspotPrimaryBtnText}>Ask AI Guide</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.hotspotSecondaryBtn}
                onPress={() => {
                  Alert.alert(
                    selectedHotspot.title,
                    `Audio narrative playing for ${selectedHotspot.title}`
                  );
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="volume-medium-outline" size={16} color="#FFFFFF" />
                <Text style={styles.hotspotSecondaryBtnText}>Listen Story</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Bottom Floating Controls Bar */}
      <View
        style={[
          styles.bottomBar,
          { bottom: insets.bottom > 0 ? insets.bottom + 12 : 20 },
        ]}
      >
        {/* Reset / Recenter Button */}
        <TouchableOpacity
          style={styles.controlIconBtn}
          onPress={() => {
            canvasRef.current?.resetCenter();
            setSelectedHotspot(null);
          }}
          accessibilityLabel="Reset Center View"
          activeOpacity={0.8}
        >
          <Ionicons name="locate-outline" size={20} color="#FFFFFF" />
          <Text style={styles.controlIconLabel}>Center</Text>
        </TouchableOpacity>

        {/* Viewpoint Switcher Pill */}
        <TouchableOpacity
          style={styles.viewpointBtn}
          onPress={() => setShowViewpointModal(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="images-outline" size={16} color="#F59E0B" />
          <Text style={styles.viewpointBtnText}>
            Viewpoint ({currentSceneIndex + 1}/{experience.scenes.length})
          </Text>
          <Ionicons name="chevron-up" size={14} color="#A8A29E" />
        </TouchableOpacity>

        {/* Audio Guide Narration Button */}
        <TouchableOpacity
          style={[styles.controlIconBtn, isPlayingThisScene && styles.controlIconBtnActive]}
          onPress={handleToggleAudio}
          accessibilityLabel="Audio Guide"
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlayingThisScene ? 'pause-circle' : 'volume-high-outline'}
            size={20}
            color={isPlayingThisScene ? '#1A1815' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.controlIconLabel,
              isPlayingThisScene && styles.controlIconLabelActive,
            ]}
          >
            {isPlayingThisScene ? 'Pause' : 'Audio'}
          </Text>
        </TouchableOpacity>

        {/* AI Guide Launcher */}
        <TouchableOpacity
          style={styles.controlIconBtn}
          onPress={() => handleAskAIGuide()}
          accessibilityLabel="Ask AI Guide"
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles-outline" size={20} color="#F59E0B" />
          <Text style={styles.controlIconLabel}>AI Guide</Text>
        </TouchableOpacity>
      </View>

      {/* Viewpoint Selection Modal */}
      <Modal
        visible={showViewpointModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowViewpointModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowViewpointModal(false)}
        >
          <View style={styles.viewpointModalContent}>
            <View style={styles.modalDragHandle} />
            <Text style={styles.modalHeading}>Select Heritage Viewpoint</Text>
            <Text style={styles.modalSubheading}>
              Explore different angles, interior halls, and panoramic elevations
            </Text>

            <ScrollView style={styles.viewpointsList} showsVerticalScrollIndicator={false}>
              {experience.scenes.map((scene, idx) => {
                const isActive = idx === currentSceneIndex;
                return (
                  <TouchableOpacity
                    key={scene.id}
                    style={[styles.viewpointCard, isActive && styles.viewpointCardActive]}
                    onPress={() => handleSwitchScene(idx)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.viewpointBadge}>
                      <Text style={styles.viewpointBadgeText}>{scene.viewpointType}</Text>
                    </View>
                    <View style={styles.viewpointInfo}>
                      <Text style={[styles.viewpointTitle, isActive && styles.viewpointTitleActive]}>
                        {scene.title}
                      </Text>
                      <Text style={styles.viewpointSub} numberOfLines={1}>
                        {scene.subtitle} • {scene.hotspots.length} hotspots
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={22} color="#F59E0B" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Experience Details / Provenance Modal */}
      <Modal
        visible={showMenuModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowMenuModal(false)}
        >
          <View style={styles.menuModalContent}>
            <Text style={styles.menuModalTitle}>{experience.siteName}</Text>
            <Text style={styles.menuModalClassification}>
              {experience.classification}
            </Text>

            <View style={styles.menuDivider} />

            <View style={styles.menuRow}>
              <Text style={styles.menuLabel}>Period / Era</Text>
              <Text style={styles.menuValue}>{experience.historicalPeriod}</Text>
            </View>
            <View style={styles.menuRow}>
              <Text style={styles.menuLabel}>Architectural Style</Text>
              <Text style={styles.menuValue}>{experience.architecturalStyle}</Text>
            </View>
            <View style={styles.menuRow}>
              <Text style={styles.menuLabel}>State Documentation</Text>
              <Text style={styles.menuValue}>{experience.provenance.source}</Text>
            </View>
            <View style={styles.menuRow}>
              <Text style={styles.menuLabel}>ASI Verification</Text>
              <Text style={styles.menuValue}>
                {experience.provenance.verified ? '✓ Verified by Curators' : 'Under Review'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.menuCloseBtn}
              onPress={() => setShowMenuModal(false)}
            >
              <Text style={styles.menuCloseBtnText}>Close Details</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0908',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0908',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  loadingText: {
    color: '#F3F4F6',
    fontSize: 16,
    fontWeight: '600',
  },
  backBtnFallback: {
    backgroundColor: '#1F1D1A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38332E',
  },
  backBtnFallbackText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(26, 24, 21, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },
  titlePill: {
    backgroundColor: 'rgba(26, 24, 21, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH - 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  titlePillHeading: {
    color: '#FFFDF9',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  titlePillSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  titlePillSub: {
    color: '#D1D5DB',
    fontSize: 10,
    fontWeight: '500',
  },
  heritageInfoOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 90,
  },
  heritageCard: {
    backgroundColor: 'rgba(23, 21, 18, 0.88)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  heritageCardHeader: {
    gap: 4,
  },
  heritageCardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  vrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  vrBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heritageCardTitle: {
    color: '#FFFDF9',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  heritageCardSubtitle: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '600',
  },
  heritageCardBody: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  heritageCardDesc: {
    color: '#E5E7EB',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '400',
  },
  provenanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  provenanceText: {
    color: '#9CA3AF',
    fontSize: 10.5,
    fontWeight: '500',
  },
  hotspotOverlay: {
    position: 'absolute',
    bottom: 96,
    left: 16,
    right: 16,
    zIndex: 95,
  },
  hotspotCard: {
    backgroundColor: '#1E1B17',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D97706',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  hotspotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  hotspotCategoryBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  hotspotCategoryText: {
    color: '#FBBF24',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  hotspotCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotTitle: {
    color: '#FFFDF9',
    fontSize: 16,
    fontWeight: '700',
  },
  hotspotSubtitle: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  hotspotDescription: {
    color: '#E5E7EB',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  hotspotProvenance: {
    color: '#9CA3AF',
    fontSize: 10.5,
    fontStyle: 'italic',
    marginTop: 6,
  },
  hotspotActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  hotspotPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F59E0B',
    paddingVertical: 9,
    borderRadius: 8,
  },
  hotspotPrimaryBtnText: {
    color: '#1A1815',
    fontSize: 12.5,
    fontWeight: '700',
  },
  hotspotSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 9,
    borderRadius: 8,
  },
  hotspotSecondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 24, 21, 0.9)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  controlIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 46,
  },
  controlIconBtnActive: {
    backgroundColor: '#F59E0B',
  },
  controlIconLabel: {
    color: '#A8A29E',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 2,
  },
  controlIconLabelActive: {
    color: '#1A1815',
  },
  viewpointBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  viewpointBtnText: {
    color: '#FFFDF9',
    fontSize: 11.5,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'flex-end',
  },
  viewpointModalContent: {
    backgroundColor: '#1E1B17',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#38332E',
    padding: 20,
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  modalDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#524B44',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeading: {
    color: '#FFFDF9',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubheading: {
    color: '#A8A29E',
    fontSize: 12.5,
    marginTop: 4,
    marginBottom: 16,
  },
  viewpointsList: {
    gap: 10,
  },
  viewpointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#27231E',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38332E',
    marginBottom: 10,
  },
  viewpointCardActive: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
  },
  viewpointBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewpointBadgeText: {
    color: '#D1D5DB',
    fontSize: 10,
    fontWeight: '700',
  },
  viewpointInfo: {
    flex: 1,
  },
  viewpointTitle: {
    color: '#FFFDF9',
    fontSize: 14,
    fontWeight: '600',
  },
  viewpointTitleActive: {
    color: '#FBBF24',
  },
  viewpointSub: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  menuModalContent: {
    backgroundColor: '#1E1B17',
    marginHorizontal: 24,
    alignSelf: 'center',
    width: SCREEN_WIDTH - 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#38332E',
    padding: 20,
    marginTop: SCREEN_HEIGHT * 0.25,
  },
  menuModalTitle: {
    color: '#FFFDF9',
    fontSize: 18,
    fontWeight: '700',
  },
  menuModalClassification: {
    color: '#F59E0B',
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#38332E',
    marginVertical: 14,
  },
  menuRow: {
    marginBottom: 10,
  },
  menuLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  menuValue: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  menuCloseBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  menuCloseBtnText: {
    color: '#1A1815',
    fontSize: 13,
    fontWeight: '700',
  },
});
