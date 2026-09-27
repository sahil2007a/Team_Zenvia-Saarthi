// Itinerary domain types — TRD §8, PRD §16
import { VisitDuration, BudgetTier, TravelGroup, MobilityLevel } from './user';

export enum PlannerDuration {
  SHORT = '30-45 min',
  MEDIUM = '1-2 hours',
  LONG = '2-3 hours',
  HALF_DAY = 'Half day',
  FULL_DAY = 'Full day',
}

export interface ItineraryStop {
  id?: string;
  order: number;
  title: string;
  name?: string;
  description: string;
  durationMinutes: number;
  duration?: number;
  wheelchairAccessible: boolean;
  accessible?: boolean;
  recommendedStoryId?: string;
  coordinates?: { latitude: number; longitude: number };
  type?: 'monument' | 'gallery' | 'viewpoint' | 'experience' | 'rest' | 'entrance' | 'exit';
  tips?: string;
}

export interface ItineraryPreferences {
  siteId: string;
  duration: VisitDuration | PlannerDuration | string;
  budget: BudgetTier | string;
  interests: string[];
  travelGroup: TravelGroup | string;
  mobility: MobilityLevel | string;
  language: string;
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  siteId: string;
  siteName: string;
  totalDurationMinutes: number;
  walkingDistanceMeters: number;
  stops: ItineraryStop[];
  createdAt: string;
  preferences: ItineraryPreferences;
  isCustom: boolean;
  isMockData?: boolean;
}

export type Itinerary = GeneratedItinerary;
export type PlannerInput = ItineraryPreferences;
