// SAARTHI Application Configuration

export const Config = {
  app: {
    name: 'SAARTHI',
    tagline: 'From where you are, to what it means.',
    version: '1.0.0',
  },

  // Storage keys — versioned per TRD §13
  storage: {
    version: 'v1',
    keys: {
      userProfile: '@saarthi_v1_user_profile',
      onboardingCompleted: '@saarthi_v1_onboarding_completed',
      offlinePacks: '@saarthi_v1_offline_packs',
      savedItineraries: '@saarthi_v1_saved_itineraries',
      recentlyViewed: '@saarthi_v1_recently_viewed',
      savedSites: '@saarthi_v1_saved_sites',
      audioHistory: '@saarthi_v1_audio_history',
      language: '@saarthi_v1_language',
      accessibility: '@saarthi_v1_accessibility',
      demoMode: '@saarthi_v1_demo_mode',
    },
  },

  // Search
  search: {
    debounceMs: 300,
    maxResults: 50,
  },

  // Location
  location: {
    proximityThresholdMeters: 100,
    watchIntervalMs: 5000,
    highAccuracy: true,
  },

  // Audio
  audio: {
    defaultSpeed: 1.0,
    speeds: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  },

  // Offline
  offline: {
    // Simulated download duration in ms
    downloadSimulationMs: 3000,
    progressIntervalMs: 100,
  },

  // Demo mode
  demo: {
    defaultSiteId: 'qutub-minar',
    simulatedLocation: {
      latitude: 28.5245,
      longitude: 77.1855,
      name: 'Main Gateway — Qutub Complex',
    },
  },

  // Default values
  defaults: {
    language: 'en' as const,
    textScale: 1.0,
    largeTextScale: 1.3,
  },
} as const;
