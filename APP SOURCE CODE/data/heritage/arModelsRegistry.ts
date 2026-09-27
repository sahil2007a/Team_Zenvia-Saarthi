// SAARTHI — Centralized AR & 3D Model Registry
// Provides metadata and asset paths for AR experiences across Indian heritage monuments
// Linked with offline-ready Base64 and optimized GLB models

import { ARModelConfig } from '../../types/ar';
import { QUTUB_MINAR_GLB_DATA_URI } from '../models/qutubMinarBase64';
import { INDIA_GATE_GLB_DATA_URI } from '../models/indiaGateBase64';

export class ARModelsRegistry {
  private registry: Record<string, ARModelConfig> = {
    'qutub-minar': {
      siteId: 'qutub-minar',
      modelUrl: '/models/qutub_minar_3d_model.glb',
      base64DataUri: QUTUB_MINAR_GLB_DATA_URI,
      fallbackModelUrl:
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
      modelTitle: 'Qutub Minar',
      locationName: 'Mehrauli, New Delhi',
      initialScale: 0.28,
      scaleRange: [0.05, 0.9],
      verticalOffset: 0,
      lightIntensity: 1.4,
      description:
        'A magnificent 72.5-meter tapering victory minaret begun by Qutb-ud-din Aibak in 1192 CE. Built with red sandstone and white marble with distinctive projecting corbelled balconies.',
    },
    'india-gate': {
      siteId: 'india-gate',
      modelUrl: '/models/india_gate_lowpoly_3d_model.glb',
      base64DataUri: INDIA_GATE_GLB_DATA_URI,
      fallbackModelUrl:
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
      modelTitle: 'India Gate',
      locationName: 'Rajpath, New Delhi',
      initialScale: 0.22,
      scaleRange: [0.05, 0.8],
      verticalOffset: 0,
      lightIntensity: 1.4,
      description:
        'A 42m triumphal war memorial arch designed by Sir Edwin Lutyens, commemorating Indian soldiers who died in World War I.',
    },
  };

  /**
   * Get AR configuration by heritage site ID
   */
  getModelBySiteId(siteId: string): ARModelConfig | null {
    if (!siteId) return null;
    const normalized = siteId.toLowerCase().trim();
    return this.registry[normalized] || null;
  }

  /**
   * Check if a site has a dedicated AR 3D model
   */
  hasARModel(siteId: string): boolean {
    return Boolean(this.getModelBySiteId(siteId));
  }

  /**
   * Register a new AR model dynamically for future monument extensions
   */
  registerModel(config: ARModelConfig): void {
    this.registry[config.siteId.toLowerCase()] = config;
  }

  /**
   * List all site IDs with available AR models
   */
  getAllAvailableSiteIds(): string[] {
    return Object.keys(this.registry);
  }
}

export const arModelsRegistry = new ARModelsRegistry();
