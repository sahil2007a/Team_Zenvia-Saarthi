// Audio Service — TRD §16, §17
// Abstraction for audio playback and audio guide controls

import type { AudioService, AudioPlaybackState } from '../../types/services';
import { useAudioStore } from '../../store/audioStore';

class SarthiAudioService implements AudioService {
  private timer: ReturnType<typeof setInterval> | null = null;

  async play(audioId: string, language?: string): Promise<void> {
    const store = useAudioStore.getState();
    store.playTrack({
      id: audioId,
      title: 'Heritage Narration Guide',
      duration: 180,
      language: language || store.selectedLanguage,
    });
    this.startTimer();
  }

  async pause(): Promise<void> {
    useAudioStore.getState().pause();
    this.stopTimer();
  }

  async resume(): Promise<void> {
    useAudioStore.getState().resume();
    this.startTimer();
  }

  async stop(): Promise<void> {
    useAudioStore.getState().stop();
    this.stopTimer();
  }

  async seek(position: number): Promise<void> {
    useAudioStore.getState().seekTo(position);
  }

  async setSpeed(speed: number): Promise<void> {
    useAudioStore.getState().setSpeed(speed);
  }

  getState(): AudioPlaybackState {
    return useAudioStore.getState().playbackState;
  }

  getCurrentPosition(): number {
    return useAudioStore.getState().position;
  }

  getDuration(): number {
    return useAudioStore.getState().currentTrack?.duration || 0;
  }

  private startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      useAudioStore.getState().tick(1);
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const audioService = new SarthiAudioService();
