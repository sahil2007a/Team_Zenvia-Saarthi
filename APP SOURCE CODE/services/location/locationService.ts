// SAARTHI Location Service — TRD §14, §15 & PRD §17
// Handles real GPS via expo-location, foreground permissions, human-friendly distance calculations,
// reverse geocoding for area names, and simulation mode for demo presentations.

import * as Location from 'expo-location';
import { Platform } from 'react-native';
import type { LocationCoordinates, LocationPermissionStatus, NearbySiteInfo } from '../../types/location';
import { heritageSites } from '../../data/sites';
import { curatedHeritageHubs } from '../../data/places/nearbyPlacesData';
import { useLocationStore } from '../../store/locationStore';

class SarthiLocationService {
  /**
   * Checks current foreground location permission status without prompting
   */
  async checkLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const mappedStatus: LocationPermissionStatus =
        status === 'granted'
          ? 'granted'
          : status === 'denied'
          ? 'denied'
          : 'undetermined';

      useLocationStore.getState().setPermissionStatus(mappedStatus);
      return mappedStatus;
    } catch {
      return 'undetermined';
    }
  }

  /**
   * Requests foreground location permission from user
   */
  async requestLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const mappedStatus: LocationPermissionStatus =
        status === 'granted'
          ? 'granted'
          : status === 'denied'
          ? 'denied'
          : 'undetermined';

      useLocationStore.getState().setPermissionStatus(mappedStatus);
      return mappedStatus;
    } catch (err) {
      console.warn('Location permission request failed:', err);
      useLocationStore.getState().setPermissionStatus('denied');
      return 'denied';
    }
  }

  /**
   * Retrieves current coordinates, respecting simulation mode if active
   */
  async getCurrentLocation(): Promise<LocationCoordinates | null> {
    const store = useLocationStore.getState();

    // Respect demo/simulated mode
    if (store.isSimulated && store.currentCoordinates) {
      return store.currentCoordinates;
    }

    try {
      const permission = await this.checkLocationPermission();
      if (permission !== 'granted') {
        const requested = await this.requestLocationPermission();
        if (requested !== 'granted') {
          return null;
        }
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? undefined,
        altitude: position.coords.altitude ?? undefined,
        heading: position.coords.heading ?? undefined,
        speed: position.coords.speed ?? undefined,
      };

      store.setCoordinates(coords);
      return coords;
    } catch (error) {
      console.warn('Failed to obtain current GPS location:', error);
      return null;
    }
  }

  /**
   * Watches location updates and invokes callback
   */
  async watchLocation(
    callback: (coords: LocationCoordinates) => void
  ): Promise<(() => void) | null> {
    try {
      const permission = await this.checkLocationPermission();
      if (permission !== 'granted') return null;

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 20,
        },
        (loc) => {
          const coords: LocationCoordinates = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy ?? undefined,
          };
          useLocationStore.getState().setCoordinates(coords);
          callback(coords);
        }
      );

      return () => subscription.remove();
    } catch {
      return null;
    }
  }

  /**
   * Calculates straight-line distance in kilometers (Haversine formula)
   */
  calculateDistanceKm(
    coord1: LocationCoordinates,
    coord2: LocationCoordinates
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.latitude * Math.PI) / 180) *
        Math.cos((coord2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  /**
   * Calculates straight-line distance in meters
   */
  calculateDistanceMeters(
    coord1: LocationCoordinates,
    coord2: LocationCoordinates
  ): number {
    return Math.round(this.calculateDistanceKm(coord1, coord2) * 1000);
  }

  /**
   * Formats distance into a human-friendly string without misleading decimal precision.
   * Examples: "Inside site", "350 m away", "1.2 km away", "24 km away"
   */
  formatDistance(meters?: number): string {
    if (meters === undefined || meters === null || isNaN(meters)) {
      return 'Distance unavailable';
    }

    if (meters < 30) {
      return 'Inside site';
    }

    if (meters < 1000) {
      const roundedHundreds = Math.max(50, Math.round(meters / 50) * 50);
      return `${roundedHundreds} m away`;
    }

    if (meters < 10000) {
      const km = (meters / 1000).toFixed(1);
      return `${km} km away`;
    }

    const km = Math.round(meters / 1000);
    return `${km} km away`;
  }

  /**
   * Discovers an approximate area/city name for human-friendly headers ("Near Delhi", "Near Mumbai")
   * without exposing exact coordinates.
   */
  async getApproximateAreaName(coords: LocationCoordinates): Promise<string> {
    try {
      if (Platform.OS !== 'web') {
        const [result] = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        if (result) {
          const area = result.city || result.subregion || result.district || result.region;
          if (area) return area;
        }
      }
    } catch {
      // Graceful fallback to nearest heritage hub
    }

    // Fallback: match closest known Indian Heritage Hub
    let closestHub = curatedHeritageHubs[0];
    let minDistance = Infinity;

    for (const hub of curatedHeritageHubs) {
      const dist = this.calculateDistanceKm(coords, hub.coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        closestHub = hub;
      }
    }

    return closestHub.name;
  }

  /**
   * Returns legacy nearby heritage sites for backwards compatibility
   */
  getNearbySites(
    coords: LocationCoordinates,
    radiusKm: number = 50
  ): NearbySiteInfo[] {
    return heritageSites
      .map((site) => {
        const distanceKm = this.calculateDistanceKm(coords, site.coordinates);
        return {
          site,
          distanceMeters: Math.round(distanceKm * 1000),
          isInside: distanceKm <= 0.2,
        };
      })
      .filter((item) => item.distanceMeters <= radiusKm * 1000)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  /**
   * Activates demo simulation for a specific site or coordinates
   */
  simulateLocation(siteId: string) {
    useLocationStore.getState().enableSimulation(siteId);
  }

  /**
   * Sets manual location coordinates (for "Choose Location Manually")
   */
  setManualLocation(coords: LocationCoordinates) {
    useLocationStore.getState().setCoordinates(coords);
  }

  stopSimulation() {
    useLocationStore.getState().disableSimulation();
  }
}

export const locationService = new SarthiLocationService();
