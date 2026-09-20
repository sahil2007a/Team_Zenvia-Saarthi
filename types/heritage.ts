// Heritage domain types — TRD §8, PRD §26

export enum HeritageCategory {
  Fort = 'Fort',
  Temple = 'Temple',
  Palace = 'Palace',
  Monument = 'Monument',
  Cave = 'Cave',
  Museum = 'Museum',
  ArchaeologicalSite = 'ArchaeologicalSite',
  CulturalLandscape = 'CulturalLandscape',
}

export enum KnowledgeLabel {
  VERIFIED_FACT = 'VERIFIED_FACT',
  ARCHAEOLOGICAL_EVIDENCE = 'ARCHAEOLOGICAL_EVIDENCE',
  LOCAL_TRADITION = 'LOCAL_TRADITION',
  INTERPRETATION = 'INTERPRETATION',
}

export enum StructureStatus {
  ORIGINAL = 'ORIGINAL',
  RESTORED = 'RESTORED',
  RECONSTRUCTED = 'RECONSTRUCTED',
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  LIMITED = 'LIMITED',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export enum StoryCategory {
  Architecture = 'Architecture',
  HistoricalContext = 'HistoricalContext',
  HiddenDetail = 'HiddenDetail',
  LocalStory = 'LocalStory',
  WhyItMatters = 'WhyItMatters',
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ProvenanceMetadata {
  source: string;
  sourceUrl?: string;
  sourceType: 'ASI' | 'UNESCO' | 'Academic' | 'Government' | 'LocalAuthority' | 'Unknown';
  verified: boolean;
  verifiedBy?: string;
  lastUpdated: string;
  labels: KnowledgeLabel[];
}

export interface FacilityInfo {
  id: string;
  name: string;
  type: 'toilet' | 'drinking_water' | 'parking' | 'food' | 'information' | 'first_aid' | 'shop' | 'rest_area';
  available: AvailabilityStatus;
  description?: string;
  coordinates?: Coordinates;
}

export interface SiteAccessibility {
  accessibleEntrance: AvailabilityStatus;
  ramp: AvailabilityStatus;
  accessibleToilet: AvailabilityStatus;
  parking: AvailabilityStatus;
  batteryVehicle: AvailabilityStatus;
  restAreas: AvailabilityStatus;
  wheelchairAccess?: AvailabilityStatus;
  signLanguage?: AvailabilityStatus;
  brailleSignage?: AvailabilityStatus;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  labels?: KnowledgeLabel[];
  structureStatus?: StructureStatus;
}

export interface HeritageSite {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  coordinates: Coordinates;
  description: string;
  shortDescription: string;
  images: string[];
  heritageType: HeritageCategory;
  unesco: boolean;
  unescoYear?: number;
  asiProtected: boolean;
  estimatedVisitTime: string;
  languages: string[];
  offlineAvailable: boolean;
  facilities: FacilityInfo[];
  accessibility: SiteAccessibility;
  stories: string[]; // story IDs
  highlights: string[];
  timeline: TimelineEvent[];
  openingHours?: string;
  entryFee?: string;
  bestTimeToVisit?: string;
  provenance: ProvenanceMetadata;
}

export interface HeritageStory {
  id: string;
  siteId: string;
  title: string;
  summary: string;
  content: string;
  category: StoryCategory;
  source: string;
  sourceUrl?: string;
  verified: boolean;
  verifiedBy?: string;
  lastUpdated: string;
  labels: KnowledgeLabel[];
  audioAvailable: boolean;
  audioId?: string;
  readTime: number; // minutes
  language: string;
}

export interface LocationPoint {
  id: string;
  siteId: string;
  name: string;
  type: 'entrance' | 'structure' | 'viewpoint' | 'facility' | 'exit' | 'parking' | 'information';
  latitude: number;
  longitude: number;
  description: string;
  stories: string[]; // story IDs
  audio?: string; // audio ID
  accessibility: AvailabilityStatus;
  structureStatus?: StructureStatus;
}

export interface LocalExperience {
  id: string;
  siteId: string;
  name: string;
  category: 'artisan' | 'food' | 'workshop' | 'homestay' | 'performance' | 'guide';
  description: string;
  image?: string;
  location: string;
  duration: string;
  price: string;
  verified: boolean;
  verifiedBy?: string;
  coordinates?: Coordinates;
  language?: string;
}

export interface AudioAsset {
  id: string;
  siteId: string;
  storyId?: string;
  title: string;
  duration: number; // seconds
  language: string;
  url?: string;
  isLocal: boolean;
}

export interface SiteMapData {
  siteId: string;
  points: LocationPoint[];
  routes: SiteRoute[];
  accessibleRoutes: SiteRoute[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface SiteRoute {
  id: string;
  name: string;
  points: Coordinates[];
  distance: number; // meters
  duration: number; // minutes
  accessible: boolean;
  description?: string;
}
