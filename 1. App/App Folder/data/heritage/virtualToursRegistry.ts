// SAARTHI — Centralized Virtual Tour Registry
// Future-ready provider for 360° virtual tours across Indian heritage monuments

import { VirtualTourSiteConfig } from '../../types/virtualTour';
import { qutubMinarTourConfig } from './qutubMinarTour';
import { deekshabhoomiTourConfig } from './deekshabhoomiTour';

export class VirtualTourRegistry {
  private registry: Record<string, VirtualTourSiteConfig> = {
    'qutub-minar': qutubMinarTourConfig,
    'deekshabhoomi': deekshabhoomiTourConfig,
  };

  /**
   * Get virtual tour configuration by heritage site ID
   */
  getTourBySiteId(siteId: string): VirtualTourSiteConfig | null {
    if (!siteId) return null;
    const normalized = siteId.toLowerCase().trim();
    return this.registry[normalized] || null;
  }

  /**
   * Check if a site has an active 360 virtual tour
   */
  hasVirtualTour(siteId: string): boolean {
    const config = this.getTourBySiteId(siteId);
    return Boolean(config && config.panorama?.enabled);
  }

  /**
   * Register a new virtual tour config dynamically (for future extensions)
   */
  registerTour(config: VirtualTourSiteConfig): void {
    this.registry[config.siteId.toLowerCase()] = config;
  }

  /**
   * Get all registered site IDs with virtual tours
   */
  getAllAvailableSiteIds(): string[] {
    return Object.keys(this.registry);
  }
}

export const virtualTourRegistry = new VirtualTourRegistry();
