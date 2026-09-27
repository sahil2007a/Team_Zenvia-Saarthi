import { apiClient, setAuthToken, removeAuthToken, getAuthToken } from '../api/apiClient';
import type { UserProfile } from '../../types/user';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user: UserProfile & { email?: string };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  language?: string;
  interests?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Register a new user with SAARTHI Backend
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    if (response.data.token) {
      await setAuthToken(response.data.token);
    }
    return response.data;
  }

  /**
   * Authenticate user with email and password
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    if (response.data.token) {
      await setAuthToken(response.data.token);
    }
    return response.data;
  }

  /**
   * Fetch currently authenticated profile
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const token = await getAuthToken();
      if (!token) return null;

      const response = await apiClient.get<{ success: boolean; user: UserProfile }>('/auth/me');
      return response.data.user;
    } catch (error) {
      console.warn('[AuthService] Fetching remote profile failed, falling back to local cache.');
      return null;
    }
  }

  /**
   * Sync and update user profile to backend
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await apiClient.put<{ success: boolean; user: UserProfile }>('/auth/profile', updates);
      return response.data.user;
    } catch (error) {
      console.warn('[AuthService] Profile sync to backend failed:', error);
      return null;
    }
  }

  /**
   * Check Backend Server Health
   */
  async checkHealth(): Promise<{ status: string; databaseStatus: string } | null> {
    try {
      const res = await apiClient.get('/health');
      return {
        status: res.data.status,
        databaseStatus: res.data.database?.status || 'unknown',
      };
    } catch {
      return null;
    }
  }

  /**
   * Sign out and clear stored JWT token
   */
  async logout(): Promise<void> {
    await removeAuthToken();
  }
}

export const authService = new AuthService();
