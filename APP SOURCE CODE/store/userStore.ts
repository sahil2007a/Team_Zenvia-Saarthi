// User store — TRD §12, §13
// Persists user profile, preferences, accessibility settings, and recently viewed sites
// Fully linked with SAARTHI Backend Authentication & Profile Synchronization

import { create } from 'zustand';
import { safeStorage as AsyncStorage } from '../services/storage';
import { Config } from '../constants/config';
import { authService, RegisterPayload, LoginPayload } from '../services/auth/authService';
import { getAuthToken } from '../services/api/apiClient';
import type { UserProfile, InterestCategory, AgeGroup, MobilityLevel, AccessibilityPreferences } from '../types/user';

interface UserState {
  profile: UserProfile;
  isOnboardingComplete: boolean;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  token: string | null;
  isAuthLoading: boolean;
  authError: string | null;

  // Actions
  setName: (name: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  updateProfile: (data: { name?: string; bio?: string; avatarUrl?: string }) => void;
  setLanguage: (language: string) => void;
  setInterests: (interests: InterestCategory[]) => void;
  setMobility: (mobility: MobilityLevel) => void;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  setTravelTime: (time: string) => void;
  setAudioPreference: (pref: boolean) => void;
  setAccessibility: (settings: Partial<AccessibilityPreferences>) => void;
  completeOnboarding: () => void;
  addRecentlyViewed: (siteId: string) => void;
  toggleSavedSite: (siteId: string) => void;
  addAudioHistory: (audioId: string) => void;
  incrementSitesExplored: () => void;
  incrementStoriesHeard: () => void;
  setDemoMode: (enabled: boolean) => void;
  resetProfile: () => void;

  // Auth Actions
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  syncWithBackend: () => Promise<void>;

  // Lifecycle
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  name: '',
  language: 'en',
  interests: [],
  mobility: 'full',
  ageGroup: 'adult',
  preferences: {
    travelTime: '1-2 hours',
    audioPreference: true,
    budget: 'medium',
  },
  accessibility: {
    largeText: false,
    highContrast: false,
    simpleLanguage: false,
    audioGuidance: false,
    reducedMotion: false,
  },
  savedSites: [],
  recentlyViewed: [],
  audioHistory: [],
  sitesExplored: 0,
  storiesHeard: 0,
  placesSaved: 0,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: { ...DEFAULT_PROFILE },
  isOnboardingComplete: false,
  isDemoMode: false,
  isAuthenticated: false,
  token: null,
  isAuthLoading: false,
  authError: null,

  setName: (name: string) => {
    set((state) => ({
      profile: { ...state.profile, name, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  setAvatarUrl: (avatarUrl: string) => {
    set((state) => ({
      profile: { ...state.profile, avatarUrl, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  updateProfile: (data: { name?: string; bio?: string; avatarUrl?: string }) => {
    set((state) => ({
      profile: { ...state.profile, ...data, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  setLanguage: (language: string) => {
    set((state) => ({
      profile: { ...state.profile, language, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  setInterests: (interests: InterestCategory[]) => {
    set((state) => ({
      profile: { ...state.profile, interests, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  setMobility: (mobility: MobilityLevel) => {
    set((state) => ({
      profile: { ...state.profile, mobility, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  setAgeGroup: (ageGroup: AgeGroup) => {
    set((state) => ({
      profile: { ...state.profile, ageGroup, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  setTravelTime: (time: string) => {
    set((state) => ({
      profile: {
        ...state.profile,
        preferences: { ...state.profile.preferences, travelTime: time },
        updatedAt: new Date().toISOString(),
      },
    }));
    get().persist();
  },

  setAudioPreference: (pref: boolean) => {
    set((state) => ({
      profile: {
        ...state.profile,
        preferences: { ...state.profile.preferences, audioPreference: pref },
        updatedAt: new Date().toISOString(),
      },
    }));
    get().persist();
  },

  setAccessibility: (settings: Partial<AccessibilityPreferences>) => {
    set((state) => ({
      profile: {
        ...state.profile,
        accessibility: { ...state.profile.accessibility, ...settings },
        updatedAt: new Date().toISOString(),
      },
    }));
    get().persist();
  },

  completeOnboarding: () => {
    set((state) => ({
      isOnboardingComplete: true,
      profile: { ...state.profile, onboardingCompleted: true, updatedAt: new Date().toISOString() },
    }));
    get().persist();
  },

  addRecentlyViewed: (siteId: string) => {
    set((state) => {
      const recent = [siteId, ...state.profile.recentlyViewed.filter((id) => id !== siteId)].slice(0, 20);
      return {
        profile: { ...state.profile, recentlyViewed: recent, updatedAt: new Date().toISOString() },
      };
    });
    get().persist();
  },

  toggleSavedSite: (siteId: string) => {
    set((state) => {
      const saved = state.profile.savedSites.includes(siteId)
        ? state.profile.savedSites.filter((id) => id !== siteId)
        : [...state.profile.savedSites, siteId];
      return {
        profile: {
          ...state.profile,
          savedSites: saved,
          placesSaved: saved.length,
          updatedAt: new Date().toISOString(),
        },
      };
    });
    get().persist();
  },

  addAudioHistory: (audioId: string) => {
    set((state) => {
      const history = [audioId, ...state.profile.audioHistory.filter((id) => id !== audioId)].slice(0, 50);
      return {
        profile: { ...state.profile, audioHistory: history, updatedAt: new Date().toISOString() },
      };
    });
    get().persist();
  },

  incrementSitesExplored: () => {
    set((state) => ({
      profile: { ...state.profile, sitesExplored: state.profile.sitesExplored + 1 },
    }));
    get().persist();
  },

  incrementStoriesHeard: () => {
    set((state) => ({
      profile: { ...state.profile, storiesHeard: state.profile.storiesHeard + 1 },
    }));
    get().persist();
  },

  setDemoMode: (enabled: boolean) => {
    set({ isDemoMode: enabled });
    AsyncStorage.setItem(Config.storage.keys.demoMode, JSON.stringify(enabled));
  },

  resetProfile: () => {
    set({
      profile: { ...DEFAULT_PROFILE },
      isOnboardingComplete: false,
      isAuthenticated: false,
      token: null,
      authError: null,
    });
    authService.logout();
    Promise.all([
      AsyncStorage.removeItem(Config.storage.keys.userProfile),
      AsyncStorage.removeItem(Config.storage.keys.onboardingCompleted),
      AsyncStorage.removeItem(Config.storage.keys.authToken),
    ]);
  },

  // Auth Methods
  login: async (payload: LoginPayload) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const res = await authService.login(payload);
      if (res.success && res.user) {
        set({
          isAuthenticated: true,
          token: res.token || null,
          profile: {
            ...get().profile,
            ...res.user,
            id: (res.user as any)._id || res.user.id || get().profile.id,
          },
          isAuthLoading: false,
        });
        get().persist();
        return true;
      }
      set({ isAuthLoading: false, authError: res.message || 'Login failed' });
      return false;
    } catch (err: any) {
      set({ isAuthLoading: false, authError: err.message || 'Unable to connect to server' });
      return false;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const res = await authService.register(payload);
      if (res.success && res.user) {
        set({
          isAuthenticated: true,
          token: res.token || null,
          profile: {
            ...get().profile,
            ...res.user,
            id: (res.user as any)._id || res.user.id || get().profile.id,
          },
          isAuthLoading: false,
        });
        get().persist();
        return true;
      }
      set({ isAuthLoading: false, authError: res.message || 'Registration failed' });
      return false;
    } catch (err: any) {
      set({ isAuthLoading: false, authError: err.message || 'Unable to connect to server' });
      return false;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      isAuthenticated: false,
      token: null,
      authError: null,
    });
  },

  syncWithBackend: async () => {
    const { isAuthenticated, profile } = get();
    if (!isAuthenticated) return;
    try {
      const updated = await authService.updateProfile(profile);
      if (updated) {
        set({ profile: { ...profile, ...updated } });
      }
    } catch (err) {
      console.warn('[UserStore] Backend sync failed, changes kept locally:', err);
    }
  },

  hydrate: async () => {
    try {
      const [profileStr, onboardingStr, demoStr, storedToken] = await Promise.all([
        AsyncStorage.getItem(Config.storage.keys.userProfile),
        AsyncStorage.getItem(Config.storage.keys.onboardingCompleted),
        AsyncStorage.getItem(Config.storage.keys.demoMode),
        getAuthToken(),
      ]);

      const profile = profileStr ? JSON.parse(profileStr) : DEFAULT_PROFILE;
      const isOnboardingComplete = onboardingStr ? JSON.parse(onboardingStr) : false;
      const isDemoMode = demoStr ? JSON.parse(demoStr) : false;

      set({
        profile: { ...DEFAULT_PROFILE, ...profile },
        isOnboardingComplete,
        isDemoMode,
        token: storedToken || null,
        isAuthenticated: !!storedToken,
      });

      // Background verify and sync profile if authenticated
      if (storedToken) {
        authService.getProfile().then((remoteUser) => {
          if (remoteUser) {
            set((state) => ({
              profile: { ...state.profile, ...remoteUser },
            }));
          }
        }).catch(() => {
          // Keep local profile if offline
        });
      }
    } catch (error) {
      console.warn('[UserStore] Hydration failed:', error);
    }
  },

  persist: async () => {
    try {
      const { profile, isOnboardingComplete, isAuthenticated } = get();
      await Promise.all([
        AsyncStorage.setItem(Config.storage.keys.userProfile, JSON.stringify(profile)),
        AsyncStorage.setItem(Config.storage.keys.onboardingCompleted, JSON.stringify(isOnboardingComplete)),
      ]);

      // If user is authenticated, sync updates to backend seamlessly
      if (isAuthenticated) {
        authService.updateProfile(profile).catch((err) => {
          console.warn('[UserStore] Background backend sync skipped:', err.message);
        });
      }
    } catch (error) {
      console.warn('[UserStore] Persistence failed:', error);
    }
  },
}));
