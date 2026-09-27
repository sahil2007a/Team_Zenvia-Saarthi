// Offline store — TRD §18, §19
// Manages downloaded site packs, download progress, and network status

import { create } from 'zustand';
import { safeStorage as AsyncStorage } from '../services/storage';
import { Config } from '../constants/config';
import { DownloadStatus } from '../types/common';
import type { OfflineSitePack } from '../types/services';
import { heritageSites, getSiteById } from '../data/sites';
import { getStoriesBySiteId } from '../data/stories';

interface OfflineState {
  packs: Record<string, OfflineSitePack>;
  activeDownloads: Record<string, number>; // siteId -> progress (0-100)
  isOfflineMode: boolean;

  // Actions
  downloadSite: (siteId: string) => Promise<void>;
  deletePack: (siteId: string) => Promise<void>;
  isSiteDownloaded: (siteId: string) => boolean;
  getPack: (siteId: string) => OfflineSitePack | undefined;
  setOfflineMode: (enabled: boolean) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  packs: {},
  activeDownloads: {},
  isOfflineMode: false,

  downloadSite: async (siteId: string) => {
    const site = getSiteById(siteId);
    if (!site) return;

    // Set download in progress
    set((state) => ({
      activeDownloads: { ...state.activeDownloads, [siteId]: 0 },
      packs: {
        ...state.packs,
        [siteId]: {
          siteId,
          version: '1.0',
          sizeBytes: 15 * 1024 * 1024, // ~15MB simulated pack size
          downloadedAt: new Date().toISOString(),
          status: DownloadStatus.DOWNLOADING,
          progress: 0,
          data: {
            site,
            stories: getStoriesBySiteId(siteId),
            mapData: {
              center: site.coordinates,
              zoom: 16,
              bounds: {
                north: site.coordinates.latitude + 0.01,
                south: site.coordinates.latitude - 0.01,
                east: site.coordinates.longitude + 0.01,
                west: site.coordinates.longitude - 0.01,
              },
              layers: ['monuments', 'paths', 'facilities'],
            },
            facilities: site.facilities,
            accessibility: site.accessibility,
          },
        },
      },
    }));

    // Simulate progressive download
    const totalSteps = 10;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise((res) => setTimeout(res, 200));
      const progress = Math.round((step / totalSteps) * 100);
      set((state) => ({
        activeDownloads: { ...state.activeDownloads, [siteId]: progress },
        packs: {
          ...state.packs,
          [siteId]: {
            ...state.packs[siteId],
            progress,
            status: step === totalSteps ? DownloadStatus.DOWNLOADED : DownloadStatus.DOWNLOADING,
          },
        },
      }));
    }

    // Clean up activeDownloads
    set((state) => {
      const remaining = { ...state.activeDownloads };
      delete remaining[siteId];
      return { activeDownloads: remaining };
    });

    await get().persist();
  },

  deletePack: async (siteId: string) => {
    set((state) => {
      const updated = { ...state.packs };
      delete updated[siteId];
      return { packs: updated };
    });
    await get().persist();
  },

  isSiteDownloaded: (siteId: string) => {
    const pack = get().packs[siteId];
    return pack?.status === DownloadStatus.DOWNLOADED;
  },

  getPack: (siteId: string) => {
    return get().packs[siteId];
  },

  setOfflineMode: (enabled: boolean) => {
    set({ isOfflineMode: enabled });
  },

  hydrate: async () => {
    try {
      const savedPacks = await AsyncStorage.getItem(Config.storage.keys.offlinePacks);
      if (savedPacks) {
        set({ packs: JSON.parse(savedPacks) });
      }
    } catch (err) {
      console.warn('[OfflineStore] Hydration error:', err);
    }
  },

  persist: async () => {
    try {
      const { packs } = get();
      await AsyncStorage.setItem(Config.storage.keys.offlinePacks, JSON.stringify(packs));
    } catch (err) {
      console.warn('[OfflineStore] Persistence error:', err);
    }
  },
}));
