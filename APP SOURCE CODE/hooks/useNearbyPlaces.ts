// SAARTHI — TanStack Query Hook for Nearby Places
// Handles server/provider-backed nearby discovery with caching, background refetching, and state management

import { useQuery } from '@tanstack/react-query';
import { nearbyPlacesService } from '../services/places/nearbyPlacesService';
import type { LocationCoordinates } from '../types/location';
import type { NearbyPlace, NearbyPlaceCategory } from '../types/place';

export interface UseNearbyPlacesOptions {
  coordinates: LocationCoordinates | null;
  radiusKm?: number;
  category?: NearbyPlaceCategory | string;
  query?: string;
  userInterests?: string[];
  enabled?: boolean;
}

export function useNearbyPlaces(options: UseNearbyPlacesOptions) {
  const {
    coordinates,
    radiusKm = 25,
    category = 'All',
    query,
    userInterests,
    enabled = true,
  } = options;

  return useQuery<NearbyPlace[], Error>({
    queryKey: [
      'nearby-places',
      coordinates ? Number(coordinates.latitude.toFixed(3)) : null,
      coordinates ? Number(coordinates.longitude.toFixed(3)) : null,
      radiusKm,
      category,
      query || '',
      userInterests || [],
    ],
    queryFn: async () => {
      if (!coordinates) return [];
      return nearbyPlacesService.getNearbyPlaces({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        radiusKm,
        category,
        query,
        userInterests,
      });
    },
    enabled: enabled && coordinates !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}
