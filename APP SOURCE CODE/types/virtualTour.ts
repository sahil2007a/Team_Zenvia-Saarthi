// SAARTHI — 360° Virtual Tour Types & Domain Model
// Architecture for equirectangular panoramas, 3D spherical hotspot coordinates, audio narratives, and i18n

export type VirtualTourHotspotCategory =
  | 'Architecture'
  | 'History'
  | 'Sculpture'
  | 'Inscription'
  | 'Relic'
  | 'Complex';

export interface LocalizedString {
  en: string;
  hi: string;
  mr?: string;
}

export interface VirtualTourHotspot {
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  description: LocalizedString;
  architecturalInfo: LocalizedString;
  interestingFact: LocalizedString;
  category: VirtualTourHotspotCategory;
  // Spherical Coordinates in degrees:
  // yaw: -180 to 180 (horizontal angle, 0 = forward, +90 = right, -90 = left)
  // pitch: -85 to 85 (vertical angle, +90 = straight up, -90 = straight down)
  coords: {
    yaw: number;
    pitch: number;
  };
  audio?: {
    en?: string;
    hi?: string;
  };
  imageUrl?: string;
  provenance: string;
}

export interface VirtualTourPanoramaSource {
  enabled: boolean;
  type: 'equirectangular';
  isDemo: boolean;
  // Local asset reference (e.g. require(...)) or remote URL
  assetSource: any;
  fallbackUrl?: string;
  initialView: {
    yaw: number;
    pitch: number;
    fov: number; // Field of view in degrees, default 75
  };
}

export interface VirtualTourSiteConfig {
  siteId: string;
  siteName: LocalizedString;
  city: LocalizedString;
  state: LocalizedString;
  country: LocalizedString;
  historicalPeriod: LocalizedString;
  architecturalStyle: LocalizedString;
  significance: LocalizedString;
  unesco: boolean;
  unescoYear?: number;
  classification: LocalizedString;
  panorama: VirtualTourPanoramaSource;
  hotspots: VirtualTourHotspot[];
  audioGuide?: {
    narratorName?: string;
    title: LocalizedString;
    overviewAudio?: {
      en?: string;
      hi?: string;
    };
  };
  provenance: {
    source: string;
    verified: boolean;
    lastUpdated: string;
  };
}
