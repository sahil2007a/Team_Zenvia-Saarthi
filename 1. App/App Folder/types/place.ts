// Nearby Place domain types — TRD §8 & PRD §26
// Provider-agnostic model for nearby heritage sites, landmarks, monuments, temples, and attractions

import type { SiteAccessibility } from './heritage';

export type NearbyPlaceCategory =
  | 'All'
  | 'Heritage'
  | 'Monument'
  | 'Fort'
  | 'Temple'
  | 'Palace'
  | 'Cave'
  | 'Museum'
  | 'Landmark'
  | 'Archaeological'
  | 'Cultural'
  | 'Nature';

export interface NearbyPlace {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: NearbyPlaceCategory;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  imageUrl?: string | any;
  distanceMeters?: number;
  rating?: number;
  reviewCount?: number;
  openingStatus?: 'OPEN' | 'CLOSED' | 'UNKNOWN';
  source?: string;
  sourceUrl?: string;
  verified?: boolean;
  heritageSiteId?: string; // Links to existing HeritageSite detail route if one exists
  accessibility?: SiteAccessibility;
  bestTimeToVisit?: string;
  openingHours?: string;
  entryFee?: string;
  highlights?: string[];
  websiteUrl?: string;
  directionsUrl?: string;
  lastUpdated?: string;
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  category?: NearbyPlaceCategory | string;
  query?: string;
  userInterests?: string[];
}

export interface PlacesProvider {
  getNearbyPlaces(params: NearbySearchParams): Promise<NearbyPlace[]>;
  getPlaceDetails(placeId: string): Promise<NearbyPlace | null>;
  searchPlaces(query: string, coords?: { latitude: number; longitude: number }): Promise<NearbyPlace[]>;
}
