// Service contract types — TRD §10, §11
import { DownloadStatus } from './common';
import { HeritageSite, HeritageStory, SiteFacility, AccessibilityFeatures } from './heritage';

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
  isOffline: boolean;
  source: 'local' | 'cache' | 'remote' | 'mock';
}

export interface ServiceError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
}

export interface AISource {
  name?: string;
  title: string;
  type?: string;
  sourceType?: string;
  url?: string;
  verified: boolean;
}

export interface AIResponse {
  answer: string;
  sources: AISource[];
  relatedPlaces?: { id: string; name: string; reason: string }[];
  followUpQuestions: string[];
  language?: string;
  confidence?: number;
  provenanceLabels?: string[];
  isLocalResponse?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: AISource[];
  provenanceLabels?: string[];
  followUpQuestions?: string[];
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed?: number;
  uvIndex?: number;
  icon?: string;
  forecast?: { time: string; temp: number; condition: string }[];
  advisory?: string;
  isMockData?: boolean;
}

export interface CrowdInfo {
  level: 'low' | 'moderate' | 'high' | 'unknown';
  percentage?: number;
  bestTime?: string;
  isMockData: boolean;
}

export interface SiteStatusInfo {
  status: 'open' | 'closed' | 'unknown';
  openingTime?: string;
  closingTime?: string;
  specialNote?: string;
  isMockData: boolean;
}

export interface ClosureInfo {
  isActive: boolean;
  reason?: string;
  startDate?: string;
  endDate?: string;
  affectedAreas?: string[];
  isMockData: boolean;
}

export interface OfflinePack {
  siteId: string;
  siteName?: string;
  version: string;
  downloadedAt: string;
  sizeBytes: number;
  size?: number;
  status: DownloadStatus;
  progress: number; // 0-100
  data?: {
    site: HeritageSite;
    stories: HeritageStory[];
    mapData: any;
    facilities: SiteFacility[];
    accessibility: AccessibilityFeatures;
  };
}

export type OfflineSitePack = OfflinePack;

export type AudioPlaybackState = 'stopped' | 'playing' | 'paused' | 'completed';

export interface AudioService {
  play(audioId: string, language?: string): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  seek(position: number): Promise<void>;
  setSpeed(speed: number): Promise<void>;
  getState(): AudioPlaybackState;
  getCurrentPosition(): number;
  getDuration(): number;
}

export interface AIService {
  askQuestion(
    query: string,
    context?: { siteId?: string; location?: string; language?: string }
  ): Promise<AIResponse>;
  getContextualExplanation(target: string, siteId: string): Promise<AIResponse>;
  getSimplifiedExplanation(text: string, language: string): Promise<string>;
}

export interface OfflineService {
  downloadSitePack(siteId: string, onProgress?: (p: number) => void): Promise<void>;
  deleteSitePack(siteId: string): Promise<void>;
  getDownloadedSites(): Promise<string[]>;
  isSiteDownloaded(siteId: string): boolean;
  getOfflineData(siteId: string): Promise<OfflineSitePack | null>;
}

export interface WeatherService {
  getWeather(siteId: string): Promise<WeatherInfo>;
}
