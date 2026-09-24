// Itinerary store — TRD §20, §21
// Manages generated and saved custom itineraries with AsyncStorage persistence

import { create } from 'zustand';
import { safeStorage as AsyncStorage } from '../services/storage';
import { Config } from '../constants/config';
import type { GeneratedItinerary, ItineraryPreferences } from '../types/itinerary';

interface ItineraryState {
  savedItineraries: GeneratedItinerary[];
  currentItinerary: GeneratedItinerary | null;
  isGenerating: boolean;

  // Actions
  saveItinerary: (itinerary: GeneratedItinerary) => Promise<void>;
  deleteItinerary: (itineraryId: string) => Promise<void>;
  setCurrentItinerary: (itinerary: GeneratedItinerary | null) => void;
  setIsGenerating: (generating: boolean) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  savedItineraries: [],
  currentItinerary: null,
  isGenerating: false,

  saveItinerary: async (itinerary: GeneratedItinerary) => {
    set((state) => ({
      savedItineraries: [
        itinerary,
        ...state.savedItineraries.filter((i) => i.id !== itinerary.id),
      ],
      currentItinerary: itinerary,
    }));
    await get().persist();
  },

  deleteItinerary: async (itineraryId: string) => {
    set((state) => ({
      savedItineraries: state.savedItineraries.filter((i) => i.id !== itineraryId),
      currentItinerary:
        state.currentItinerary?.id === itineraryId ? null : state.currentItinerary,
    }));
    await get().persist();
  },

  setCurrentItinerary: (itinerary: GeneratedItinerary | null) => {
    set({ currentItinerary: itinerary });
  },

  setIsGenerating: (generating: boolean) => {
    set({ isGenerating: generating });
  },

  hydrate: async () => {
    try {
      const data = await AsyncStorage.getItem(Config.storage.keys.savedItineraries);
      if (data) {
        set({ savedItineraries: JSON.parse(data) });
      }
    } catch (err) {
      console.warn('[ItineraryStore] Hydration error:', err);
    }
  },

  persist: async () => {
    try {
      const { savedItineraries } = get();
      await AsyncStorage.setItem(
        Config.storage.keys.savedItineraries,
        JSON.stringify(savedItineraries)
      );
    } catch (err) {
      console.warn('[ItineraryStore] Persistence error:', err);
    }
  },
}));
