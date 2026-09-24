// Audio store — TRD §16, §17
// Manages playback state, current audio, playback speed, and audio language

import { create } from 'zustand';
import { Config } from '../constants/config';
import type { AudioPlaybackState } from '../types/services';

interface AudioState {
  currentTrack: {
    id: string;
    storyId?: string;
    siteId?: string;
    title: string;
    duration: number; // in seconds
    language: string;
  } | null;
  playbackState: AudioPlaybackState;
  position: number; // in seconds
  speed: number;
  selectedLanguage: string;
  autoPlayNext: boolean;

  // Actions
  playTrack: (track: {
    id: string;
    storyId?: string;
    siteId?: string;
    title: string;
    duration?: number;
    language?: string;
  }) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seekTo: (position: number) => void;
  setSpeed: (speed: number) => void;
  setAudioLanguage: (lang: string) => void;
  tick: (deltaSeconds: number) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentTrack: null,
  playbackState: 'stopped',
  position: 0,
  speed: Config.audio.defaultSpeed,
  selectedLanguage: 'en',
  autoPlayNext: false,

  playTrack: (track) => {
    set({
      currentTrack: {
        id: track.id,
        storyId: track.storyId,
        siteId: track.siteId,
        title: track.title,
        duration: track.duration || 180, // Default 3 mins
        language: track.language || get().selectedLanguage,
      },
      playbackState: 'playing',
      position: 0,
    });
  },

  pause: () => {
    if (get().playbackState === 'playing') {
      set({ playbackState: 'paused' });
    }
  },

  resume: () => {
    if (get().playbackState === 'paused') {
      set({ playbackState: 'playing' });
    }
  },

  stop: () => {
    set({
      playbackState: 'stopped',
      position: 0,
    });
  },

  seekTo: (position: number) => {
    const duration = get().currentTrack?.duration || 0;
    const clamped = Math.max(0, Math.min(position, duration));
    set({ position: clamped });
  },

  setSpeed: (speed: number) => {
    set({ speed });
  },

  setAudioLanguage: (language: string) => {
    set({ selectedLanguage: language });
  },

  tick: (deltaSeconds: number) => {
    const { playbackState, position, currentTrack, speed } = get();
    if (playbackState !== 'playing' || !currentTrack) return;

    const nextPos = position + deltaSeconds * speed;
    if (nextPos >= currentTrack.duration) {
      set({
        position: currentTrack.duration,
        playbackState: 'completed',
      });
    } else {
      set({ position: nextPos });
    }
  },
}));
