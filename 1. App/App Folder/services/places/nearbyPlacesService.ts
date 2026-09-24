// SAARTHI — Nearby Places Discovery Service
// Implements provider-agnostic service boundary for location-based heritage & landmark discovery
// Supports distance filtering, category filtering, user-interest relevance ranking, and search.

import type { NearbyPlace, NearbySearchParams, PlacesProvider } from '../../types/place';
import type { LocationCoordinates } from '../../types/location';
import { nearbyPlacesCatalog } from '../../data/places/nearbyPlacesData';
import { locationService } from '../location/locationService';

/**
 * Local structured provider implementing PlacesProvider contract.
 * Easily swappable with GooglePlacesProvider or SAARTHI Backend API in production.
 */
export class LocalPlacesProvider implements PlacesProvider {
  private catalog: NearbyPlace[] = nearbyPlacesCatalog;

  async getNearbyPlaces(params: NearbySearchParams): Promise<NearbyPlace[]> {
    const { latitude, longitude, radiusKm = 25, category, query, userInterests } = params;
    const userCoords: LocationCoordinates = { latitude, longitude };
    const radiusMeters = radiusKm * 1000;

    // 1. Calculate distances for all candidate places
    const placesWithDistance = this.catalog.map((place) => {
      const placeCoords: LocationCoordinates = {
        latitude: place.latitude,
        longitude: place.longitude,
      };
      const distanceMeters = locationService.calculateDistanceMeters(userCoords, placeCoords);
      return {
        ...place,
        distanceMeters,
      };
    });

    // 2. Filter by radius
    let results = placesWithDistance.filter(
      (place) => place.distanceMeters <= radiusMeters
    );

    // 3. Filter by category if specified and not 'All'
    if (category && category.toLowerCase() !== 'all') {
      const lowerCat = category.toLowerCase();
      results = results.filter(
        (place) =>
          place.category.toLowerCase() === lowerCat ||
          (lowerCat === 'heritage' && (place.heritageSiteId || place.verified))
      );
    }

    // 4. Filter by search query if provided
    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (place) =>
          place.name.toLowerCase().includes(q) ||
          place.description.toLowerCase().includes(q) ||
          (place.city && place.city.toLowerCase().includes(q)) ||
          (place.state && place.state.toLowerCase().includes(q)) ||
          place.category.toLowerCase().includes(q)
      );
    }

    // 5. Multi-criteria relevance ranking:
    // Distance (primary) + User Interest match (secondary boost) + Heritage prominence
    results.sort((a, b) => {
      let scoreA = 100000 / (Math.max(a.distanceMeters, 50));
      let scoreB = 100000 / (Math.max(b.distanceMeters, 50));

      // Personalization interest boost
      if (userInterests && userInterests.length > 0) {
        const matchCountA = (a.highlights || []).filter((h) =>
          userInterests.some((ui) => ui.toLowerCase() === h.toLowerCase())
        ).length;
        const matchCountB = (b.highlights || []).filter((h) =>
          userInterests.some((ui) => ui.toLowerCase() === h.toLowerCase())
        ).length;

        scoreA += matchCountA * 150;
        scoreB += matchCountB * 150;
      }

      // Verified / heritage presence boost
      if (a.verified) scoreA += 50;
      if (b.verified) scoreB += 50;

      return scoreB - scoreA;
    });

    return results;
  }

  async getPlaceDetails(placeId: string): Promise<NearbyPlace | null> {
    const found = this.catalog.find((p) => p.id === placeId);
    return found || null;
  }

  async searchPlaces(
    query: string,
    coords?: { latitude: number; longitude: number }
  ): Promise<NearbyPlace[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    let matched = this.catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q))
    );

    if (coords) {
      const userCoords: LocationCoordinates = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      matched = matched.map((place) => ({
        ...place,
        distanceMeters: locationService.calculateDistanceMeters(userCoords, {
          latitude: place.latitude,
          longitude: place.longitude,
        }),
      }));

      matched.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
    }

    return matched;
  }
}

/**
 * Service Manager with pluggable provider support
 */
class NearbyPlacesServiceManager {
  private provider: PlacesProvider;

  constructor(provider: PlacesProvider = new LocalPlacesProvider()) {
    this.provider = provider;
  }

  setProvider(provider: PlacesProvider) {
    this.provider = provider;
  }

  async getNearbyPlaces(params: NearbySearchParams): Promise<NearbyPlace[]> {
    return this.provider.getNearbyPlaces(params);
  }

  async getPlaceDetails(placeId: string): Promise<NearbyPlace | null> {
    return this.provider.getPlaceDetails(placeId);
  }

  async searchPlaces(
    query: string,
    coords?: { latitude: number; longitude: number }
  ): Promise<NearbyPlace[]> {
    return this.provider.searchPlaces(query, coords);
  }
}

export const nearbyPlacesService = new NearbyPlacesServiceManager();
