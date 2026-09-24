// Crowd & Real-time Site Status Service — PRD §17
// Provides estimated footfall, peak hour alerts, and current operational status

export interface CrowdStatus {
  level: 'Low' | 'Moderate' | 'High';
  percentage: number;
  bestTimeToVisit: string;
  isOpen: boolean;
  activeClosures: string[];
}

class SarthiCrowdService {
  async getStatus(siteId: string): Promise<CrowdStatus> {
    const currentHour = new Date().getHours();
    const isPeak = currentHour >= 11 && currentHour <= 15;
    const isWeekend = [0, 6].includes(new Date().getDay());

    let level: 'Low' | 'Moderate' | 'High' = 'Low';
    let percentage = 25;

    if (isPeak && isWeekend) {
      level = 'High';
      percentage = 85;
    } else if (isPeak || isWeekend) {
      level = 'Moderate';
      percentage = 55;
    }

    return {
      level,
      percentage,
      bestTimeToVisit: 'Early morning (07:00 AM - 09:30 AM) or sunset',
      isOpen: currentHour >= 7 && currentHour <= 17,
      activeClosures: [],
    };
  }
}

export const crowdService = new SarthiCrowdService();
