// Weather Service — PRD §17, TRD §6
// Provides live or simulated typical weather conditions for heritage destinations

import type { WeatherService, WeatherInfo } from '../../types/services';
import { getSiteById } from '../../data/sites';

class SarthiWeatherService implements WeatherService {
  async getWeather(siteId: string): Promise<WeatherInfo> {
    const site = getSiteById(siteId);
    // Typical pleasant weather mock based on location
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour <= 18;

    return {
      temperature: isDay ? 26 : 20,
      condition: 'Sunny / Clear',
      humidity: 48,
      windSpeed: 12,
      uvIndex: 4,
      forecast: [
        { time: '10:00 AM', temp: 24, condition: 'Clear' },
        { time: '01:00 PM', temp: 28, condition: 'Sunny' },
        { time: '04:00 PM', temp: 26, condition: 'Partly Cloudy' },
      ],
      advisory:
        'Favorable conditions for exploring monuments. Sun protection and hydration recommended.',
    };
  }
}

export const weatherService = new SarthiWeatherService();
