// SAARTHI Resilient Storage Service
// Graceful fallback to memory storage if native AsyncStorage is unavailable
import AsyncStorage from '@react-native-async-storage/async-storage';

class SafeStorage {
  private memoryCache: Map<string, string> = new Map();
  private isNativeAvailable: boolean = true;

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.isNativeAvailable) {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      this.isNativeAvailable = false;
    }
    return this.memoryCache.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.memoryCache.set(key, value);
    try {
      if (this.isNativeAvailable) {
        await AsyncStorage.setItem(key, value);
      }
    } catch {
      this.isNativeAvailable = false;
    }
  }

  async removeItem(key: string): Promise<void> {
    this.memoryCache.delete(key);
    try {
      if (this.isNativeAvailable) {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      this.isNativeAvailable = false;
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    try {
      if (this.isNativeAvailable) {
        await AsyncStorage.clear();
      }
    } catch {
      this.isNativeAvailable = false;
    }
  }
}

export const safeStorage = new SafeStorage();
export default safeStorage;
