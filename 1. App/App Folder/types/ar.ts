// SAARTHI — Augmented Reality (AR) & 3D Model Domain Types
// Supports WebXR, WebAR Camera Feed, Plane Detection, and 3D GLTF Inspection

export interface ARModelConfig {
  siteId: string;
  modelUrl: string;
  fallbackModelUrl?: string;
  modelTitle: string;
  locationName: string;
  initialScale: number;
  scaleRange: [number, number]; // [min, max]
  verticalOffset?: number; // adjustment so bottom of model sits flush on the plane
  rotationOffset?: [number, number, number]; // [x, y, z] in radians
  lightIntensity?: number;
  description?: string;
}

export type ARSessionState =
  | 'initializing'
  | 'requesting_camera'
  | 'permission_denied'
  | 'detecting_surface'
  | 'surface_detected'
  | 'model_placed'
  | 'unsupported'
  | 'model_error';

export interface ARSurfacePlane {
  detected: boolean;
  confidence: number;
  position: { x: number; y: number; z: number };
  normal: { x: number; y: number; z: number };
}
