import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { safeStorage as AsyncStorage } from '../storage';
import { Config } from '../../constants/config';

// Create base Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: Config.api.baseUrl,
  timeout: Config.api.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(Config.storage.keys.authToken);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (storageErr) {
      console.warn('[ApiClient] Failed to read auth token from storage:', storageErr);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors and handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const isNetworkError = !error.response;
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message || error.message;

    if (isNetworkError) {
      console.warn('[ApiClient] Network offline or server unreachable. Operating in offline-safe mode.');
    } else if (status === 401) {
      console.warn('[ApiClient] Unauthorized session or token expired.');
    }

    const enhancedError = new Error(serverMessage);
    (enhancedError as any).status = status;
    (enhancedError as any).isNetworkError = isNetworkError;

    return Promise.reject(enhancedError);
  }
);

// Helper methods to manage auth tokens
export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(Config.storage.keys.authToken, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(Config.storage.keys.authToken);
};

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(Config.storage.keys.authToken);
};
