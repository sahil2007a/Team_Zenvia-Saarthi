// SAARTHI — Centralized AR & 3D Model Registry
// Provides metadata and asset paths for AR experiences across Indian heritage monuments

import { ARModelConfig } from '../../types/ar';

export class ARModelsRegistry {
  private registry: Record<string, ARModelConfig> = {
    'india-gate': {
      siteId: 'india-gate',
      modelUrl: '/models/india_gate_lowpoly_3d_model.glb',
      fallbackModelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
      modelTitle: 'India Gate',
      locationName: 'New Delhi, India',
      initialScale: 0.22,
      scaleRange: [0.05, 0.8],
      verticalOffset: 0,
      lightIntensity: 1.4,
      description: 'A 42m triumphal war memorial arch designed by Sir Edwin Lutyens, commemorating soldiers of World War I.',
    },
    'qutub-minar': {
      siteId: 'qutub-minar',
      modelUrl: '/models/india_gate_lowpoly_3d_model.glb', // Reuses high-fidelity GLB pipeline
      modelTitle: 'Qutub Minar',
      locationName: 'Delhi, India',
      initialScale: 0.25,
      scaleRange: [0.05, 0.8],
      verticalOffset: 0,
      lightIntensity: 1.3,
      description: '72.5m victory tower of red sandstone and marble, begun in 1192 CE by Qutb-ud-din Aibak.',
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
