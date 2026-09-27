// Offline Service — TRD §18, §19
// Manages offline packs, verification, and offline fallback queries

import type { OfflineService, OfflineSitePack } from '../../types/services';
import { DownloadStatus } from '../../types/common';
import { useOfflineStore } from '../../store/offlineStore';
import { getSiteById } from '../../data/sites';
import { getStoriesBySiteId } from '../../data/stories';

class SarthiOfflineService implements OfflineService {
  async downloadSitePack(
    siteId: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const offlineStore = useOfflineStore.getState();
    await offlineStore.downloadSite(siteId);
    if (onProgress) {
      onProgress(100);
    }
  }

  async deleteSitePack(siteId: string): Promise<void> {
    const offlineStore = useOfflineStore.getState();
    await offlineStore.deletePack(siteId);
  }

  async getDownloadedSites(): Promise<string[]> {
    const packs = useOfflineStore.getState().packs;
    return Object.keys(packs).filter(
      (id) => packs[id].status === DownloadStatus.DOWNLOADED
    );
  }

  isSiteDownloaded(siteId: string): boolean {
    return useOfflineStore.getState().isSiteDownloaded(siteId);
  }

  async getOfflineData(siteId: string): Promise<OfflineSitePack | null> {
    const pack = useOfflineStore.getState().getPack(siteId);
    if (pack && pack.status === DownloadStatus.DOWNLOADED) {
      return pack;
    }

    // If not formally downloaded but present in seeded bundle, return default structure
    const site = getSiteById(siteId);
    if (!site) return null;

    return {
      siteId,
      version: '1.0',
      sizeBytes: 10 * 1024 * 1024,
      downloadedAt: new Date().toISOString(),
      status: DownloadStatus.DOWNLOADED,
      progress: 100,
      data: {
        site,
        stories: getStoriesBySiteId(siteId),
        mapData: {
          center: site.coordinates,
          zoom: 16,
          bounds: {
            north: site.coordinates.latitude + 0.01,
            south: site.coordinates.latitude - 0.01,
            east: site.coordinates.longitude + 0.01,
            west: site.coordinates.longitude - 0.01,
          },
          layers: ['monuments', 'paths', 'facilities'],
        },
        facilities: site.facilities,
        accessibility: site.accessibility,
      },
    };
  }
}

export const offlineService = new SarthiOfflineService();
