// SAARTHI — Reusable 360° Virtual Tour Viewer
// Future-ready container component accepting site configurations for Qutub Minar and subsequent monuments

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  ThreePanoramaCanvas,
  ThreePanoramaCanvasRef,
  ProjectedHotspot,
} from './ThreePanoramaCanvas';
import { VirtualTourHotspotPin } from './VirtualTourHotspotPin';
import { VirtualTourHUD } from './VirtualTourHUD';
import { VirtualTourSiteConfig, VirtualTourHotspot } from '../../types/virtualTour';
import { virtualTourRegistry } from '../../data/heritage/virtualToursRegistry';
import { qutubMinarTourConfig } from '../../data/heritage/qutubMinarTour';
import { useAudioStore } from '../../store/audioStore';

export interface VirtualTourViewerProps {
  site?: VirtualTourSiteConfig;
  siteId?: string;
  onExit?: () => void;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  site: propSite,
  siteId = 'qutub-minar',
  onExit,
}) => {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const canvasRef = useRef<ThreePanoramaCanvasRef>(null);

  // Audio store integration
  const playTrack = useAudioStore((s) => s.playTrack);
  const pauseAudio = useAudioStore((s) => s.pause);
  const playbackState = useAudioStore((s) => s.playbackState);

  // Resolve configuration from prop or registry
  const siteConfig: VirtualTourSiteConfig =
    propSite || virtualTourRegistry.getTourBySiteId(siteId) || qutubMinarTourConfig;

  // Language state (synced with app i18n, defaults to 'en' or 'hi')
  const [language, setLanguage] = useState<'en' | 'hi'>(
    i18n.language?.startsWith('hi') ? 'hi' : 'en'
  );

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<VirtualTourHotspot | null>(null);
  const [showOnboardingHint, setShowOnboardingHint] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fast loading safety fallback: never block virtual tour for > 400ms
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(safetyTimer);
  }, [reloadKey]);

  // Auto-hide onboarding hint after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboardingHint(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Sync language changes with global i18n
  useEffect(() => {
    if (i18n.language && (i18n.language.startsWith('hi') || i18n.language.startsWith('en'))) {
      setLanguage(i18n.language.startsWith('hi') ? 'hi' : 'en');
    }
  }, [i18n.language]);

  // Fullscreen change listener on web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Web Speech synthesis audio narration fallback
  const speakNarrative = useCallback((text: string, langCode: 'en' | 'hi') => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopNarrative = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  }, []);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopNarrative();
      pauseAudio();
    } else {
      const narrative =
        siteConfig.audioGuide?.overviewAudio?.[language] ||
        siteConfig.audioGuide?.overviewAudio?.en ||
        siteConfig.significance[language];
      speakNarrative(narrative, language);
    }
  };

  const handlePlayHotspotAudio = (hotspot: VirtualTourHotspot) => {
    const textToSpeak = `${hotspot.title[language]}. ${hotspot.description[language]}. ${hotspot.architecturalInfo[language]}`;
    speakNarrative(textToSpeak, language);
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);

    // If audio is playing, switch audio narration language seamlessly
    if (isPlayingAudio) {
      const narrative =
        siteConfig.audioGuide?.overviewAudio?.[nextLang] ||
        siteConfig.audioGuide?.overviewAudio?.en ||
        siteConfig.significance[nextLang];
      speakNarrative(narrative, nextLang);
    }
  };

  const handleToggleFullscreen = () => {
    if (Platform.OS !== 'web') return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleResetView = () => {
    canvasRef.current?.resetView();
    setSelectedHotspot(null);
  };

  const handleBack = () => {
    stopNarrative();
    if (onExit) {
      onExit();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/site/${siteConfig.siteId}` as any);
    }
  };

  const handleTryAgain = () => {
    setErrorMessage(null);
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const handleHotspotSelect = (hotspot: VirtualTourHotspot | null) => {
    setSelectedHotspot(hotspot);
    if (hotspot) {
      // Direct camera attention towards hotspot
      canvasRef.current?.panToCoords(hotspot.coords.yaw, hotspot.coords.pitch);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. Main 360 Three.js Spherical Panorama Canvas */}
      {!errorMessage && (
        <ThreePanoramaCanvas
          key={`panorama-${siteConfig.siteId}-${reloadKey}`}
          ref={canvasRef}
          panorama={siteConfig.panorama}
          hotspots={siteConfig.hotspots}
          onProjectHotspots={setProjectedHotspots}
          onFirstInteraction={() => setShowOnboardingHint(false)}
          onLoadingChange={setIsLoading}
          onError={(err) => {
            setErrorMessage(err);
            setIsLoading(false);
          }}
        />
      )}

      {/* 2. Projected Interactive 3D Hotspot Pins */}
      {!isLoading &&
        !errorMessage &&
        projectedHotspots.map(({ hotspot, screenX, screenY, visible }) => (
          <VirtualTourHotspotPin
            key={hotspot.id}
            hotspot={hotspot}
            screenX={screenX}
            screenY={screenY}
            visible={visible}
            isSelected={selectedHotspot?.id === hotspot.id}
            language={language}
            onPress={handleHotspotSelect}
          />
        ))}

      {/* 3. Floating HUD Controls (Top Bar, Bottom Panel, Hotspot Cards) */}
      {!errorMessage && (
        <VirtualTourHUD
          site={siteConfig}
          language={language}
          isPlayingAudio={isPlayingAudio}
          isFullscreen={isFullscreen}
          showOnboardingHint={showOnboardingHint && !isLoading}
          selectedHotspot={selectedHotspot}
          onBack={handleBack}
          onToggleAudio={handleToggleAudio}
          onToggleLanguage={handleToggleLanguage}
          onToggleFullscreen={handleToggleFullscreen}
          onResetView={handleResetView}
          onSelectHotspot={handleHotspotSelect}
          onPlayHotspotAudio={handlePlayHotspotAudio}
        />
      )}

      {/* 4. Loading State Screen ("Preparing Virtual Tour...") */}
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="box-none">
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingTitle}>
              {language === 'hi' ? 'वर्चुअल टूर तैयार हो रहा है...' : 'Preparing Virtual Tour...'}
            </Text>
            <Text style={styles.loadingSubtitle}>
              {siteConfig.siteName[language] || siteConfig.siteName.en} • 360° Spherical View
            </Text>
            <View style={styles.loadingPill}>
              <Ionicons name="sparkles" size={12} color="#F59E0B" />
              <Text style={styles.loadingPillText}>
                {language === 'hi' ? '3D वातावरण लोड हो रहा है' : 'Loading 3D Environment'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 5. Error & Fallback State Screen */}
      {errorMessage && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>
              {language === 'hi'
                ? 'वर्चुअल टूर वर्तमान में उपलब्ध नहीं है'
                : 'Virtual tour temporarily unavailable.'}
            </Text>
            <Text style={styles.errorDesc}>
              {language === 'hi'
                ? '360° पैनोरमा लोड करने में समस्या आई। कृपया पुनः प्रयास करें।'
                : 'Could not load the 360° spherical environment. Please check your connection and try again.'}
            </Text>
            <View style={styles.errorButtonsRow}>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={handleTryAgain}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.retryBtnText}>
                  {language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.errorBackBtn}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Text style={styles.errorBackBtnText}>
                  {language === 'hi'
                    ? `${siteConfig.siteName[language]} पर वापस जाएं`
                    : `Back to ${siteConfig.siteName.en}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070B',
    position: 'relative',
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5, 7, 11, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
  },
  loadingCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 28,
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    maxWidth: 340,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },
  loadingSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  loadingPillText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '600',
  },

  // Error overlay
  errorOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#05070B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 300,
  },
  errorCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  errorDesc: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
  },
  errorButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  errorBackBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    borderRadius: 10,
  },
  errorBackBtnText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
  },
});
