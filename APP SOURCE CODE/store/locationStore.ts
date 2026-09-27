// Location store — TRD §14, §15
// Manages device location, simulated location for demo, permissions, and nearby site triggers

import { create } from 'zustand';
import { Config } from '../constants/config';
import type { LocationCoordinates, LocationPermissionStatus } from '../types/location';
import { heritageSites } from '../data/sites';

interface LocationState {
  currentCoordinates: LocationCoordinates | null;
  permissionStatus: LocationPermissionStatus;
  isSimulated: boolean;
  simulatedSiteId: string | null;
  nearestSiteId: string | null;
  nearestDistanceMeters: number | null;

  // Actions
  setCoordinates: (coords: LocationCoordinates) => void;
  setPermissionStatus: (status: LocationPermissionStatus) => void;
  enableSimulation: (siteId: string) => void;
  disableSimulation: () => void;
  updateNearestSite: () => void;
}

// Distance calculation helper (Haversine formula in meters)
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentCoordinates: null,
  permissionStatus: 'undetermined',
  isSimulated: false,
  simulatedSiteId: null,
  nearestSiteId: null,
  nearestDistanceMeters: null,

  setCoordinates: (coords: LocationCoordinates) => {
    set({ currentCoordinates: coords });
    get().updateNearestSite();
  },

  setPermissionStatus: (status: LocationPermissionStatus) => {
    set({ permissionStatus: status });
  },

  enableSimulation: (siteId: string) => {
    const site = heritageSites.find((s) => s.id === siteId) || heritageSites[0];
    set({
      isSimulated: true,
      simulatedSiteId: site.id,
      currentCoordinates: site.coordinates,
      nearestSiteId: site.id,
      nearestDistanceMeters: 25, // Inside site threshold (25m away)
    });
  },

  disableSimulation: () => {
    set({
      isSimulated: false,
      simulatedSiteId: null,
      currentCoordinates: null,
      nearestSiteId: null,
      nearestDistanceMeters: null,
    });
  },

  updateNearestSite: () => {
    const { currentCoordinates } = get();
    if (!currentCoordinates) return;

    let closestSiteId: string | null = null;
    let minDistance = Infinity;

    heritageSites.forEach((site) => {
      const dist = calculateDistanceMeters(
        currentCoordinates.latitude,
        currentCoordinates.longitude,
        site.coordinates.latitude,
        site.coordinates.longitude
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestSiteId = site.id;
      }
    });

    set({
      nearestSiteId: closestSiteId,
      nearestDistanceMeters: minDistance === Infinity ? null : Math.round(minDistance),
    });
  },
}));
