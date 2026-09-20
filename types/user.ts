// User domain types — TRD §8, PRD §24

export type AgeGroup = 'child' | 'teen' | 'young_adult' | 'adult' | 'senior';

export type MobilityLevel = 'full' | 'limited' | 'wheelchair' | 'assisted';

export type TravelGroup = 'solo' | 'couple' | 'family' | 'friends' | 'group' | 'school';

export type InterestCategory =
  | 'Architecture'
  | 'History'
  | 'Culture'
  | 'Religion'
  | 'Photography'
  | 'LocalStories'
  | 'Food'
  | 'Craft'
  | 'Nature';

export interface AccessibilityPreferences {
  largeText: boolean;
  highContrast: boolean;
  simpleLanguage: boolean;
  audioGuidance: boolean;
  reducedMotion: boolean;
}

export interface UserPreferences {
  travelTime: string;
  audioPreference: boolean;
  budget?: 'low' | 'medium' | 'high';
  travelGroup?: TravelGroup;
}

export interface UserProfile {
  id: string;
  name: string;
  language: string;
  interests: InterestCategory[];
  mobility: MobilityLevel;
  ageGroup: AgeGroup;
  preferences: UserPreferences;
  accessibility: AccessibilityPreferences;
  savedSites: string[];
  recentlyViewed: string[];
  audioHistory: string[];
  sitesExplored: number;
  storiesHeard: number;
  placesSaved: number;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
