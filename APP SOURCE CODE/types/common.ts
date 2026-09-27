// Common types and enums — TRD §9

export enum DownloadStatus {
  NOT_DOWNLOADED = 'NOT_DOWNLOADED',
  DOWNLOADING = 'DOWNLOADING',
  DOWNLOADED = 'DOWNLOADED',
  FAILED = 'FAILED',
}

export enum SiteStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  UNKNOWN = 'UNKNOWN',
}

export enum AudioState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'kn' | 'gu' | 'pa' | 'ml';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
  pa: 'ਪੰਜਾਬੀ',
  ml: 'മലയാളം',
};

export const IMPLEMENTED_LANGUAGES: SupportedLanguage[] = ['en', 'hi', 'mr'];
export const PLACEHOLDER_LANGUAGES: SupportedLanguage[] = ['bn', 'ta', 'te', 'kn', 'gu', 'pa', 'ml'];

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
