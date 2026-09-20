// Itinerary domain types — TRD §8, PRD §16

export enum PlannerDuration {
  SHORT = '30-45 min',
  MEDIUM = '1-2 hours',
  LONG = '2-3 hours',
  HALF_DAY = 'Half day',
  FULL_DAY = 'Full day',
}

export interface ItineraryStop {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  type: 'monument' | 'gallery' | 'viewpoint' | 'experience' | 'rest' | 'entrance' | 'exit';
  coordinates?: { latitude: number; longitude: number };
  accessible: boolean;
  offlineAvailable: boolean;
  order: number;
  tips?: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  siteId: string;
  duration: PlannerDuration;
  totalDurationMinutes: number;
  stops: ItineraryStop[];
  estimatedCost: string;
  walkingDistance: string;
  accessibility: string;
  offlineAvailable: boolean;
  createdAt: string;
  language: string;
  interests: string[];
  travelGroup?: string;
  ageGroup?: string;
  isMockData: boolean; // honest labeling per TRD §18
}

export interface PlannerInput {
  destination: string;
  siteId: string;
  duration: PlannerDuration;
  budget: 'low' | 'medium' | 'high';
  interests: string[];
  travelGroup: string;
  ageGroup: string;
  mobility: string;
  language: string;
}
