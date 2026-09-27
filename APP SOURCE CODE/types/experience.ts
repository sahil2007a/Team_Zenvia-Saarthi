// SAARTHI — Immersive Heritage Experience Types
// Structured domain model for VR-style panoramic exploration, architectural hotspots, and multi-viewpoint scenes

export type HotspotCategory =
  | 'Architecture'
  | 'History'
  | 'Sculpture'
  | 'Inscription'
  | 'Relic'
  | 'Spiritual';

export interface ExperienceHotspot {
  id: string;
  sceneId: string;
  title: string;
  subtitle?: string;
  description: string;
  category: HotspotCategory;
  // Normalized position on panoramic canvas (0 to 100 percentage)
  position: {
    x: number; // 0 to 100% horizontally
    y: number; // 0 to 100% vertically
  };
  audioId?: string;
  targetSceneId?: string; // If hotspot leads to another viewpoint
  provenance?: string;
}

export interface HeritageScene {
  id: string;
  siteId: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  viewpointType: 'Panoramic' | 'Exterior' | 'Interior' | 'Aerial' | 'Detail';
  hotspots: ExperienceHotspot[];
  audioNarrative?: string;
}

export interface HeritageExperience {
  siteId: string;
  siteName: string;
  city: string;
  state: string;
  classification: string;
  coverImage: string;
  historicalPeriod: string;
  architecturalStyle: string;
  scenes: HeritageScene[];
  provenance: {
    source: string;
    verified: boolean;
    lastUpdated: string;
  };
}
