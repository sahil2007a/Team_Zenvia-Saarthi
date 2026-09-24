// Location domain types — TRD §19
import { HeritageSite } from './heritage';

export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined' | 'restricted';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export type LocationCoordinates = LocationCoords;

export interface NearbySiteInfo {
  site: HeritageSite;
  distanceMeters: number;
  isInside: boolean;
}

export interface LocationState {
  coords: LocationCoords | null;
  permission: LocationPermissionStatus;
  isSimulated: boolean;
  isWatching: boolean;
  error?: string;
}

export interface NearbyPoint {
  pointId: string;
  name: string;
  distance: number; // meters
  type: string;
  description: string;
}

export interface GeofenceRegion {
  id: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
  name: string;
}
