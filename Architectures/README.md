# System Architecture & Diagrams

This directory contains system architecture diagrams, data flow representations, and design schematics for **SAARTHI**.

## 🏗️ High-Level Architectural Overview

```
+-------------------------------------------------------------------------+
|                              SAARTHI CLIENT                             |
|              (React Native / Expo Mobile & Web Cross-Platform)          |
+-------------------------------------------------------------------------+
    |                     |                         |                  |
    v                     v                         v                  v
+----------+       +--------------+          +--------------+   +-------------+
| AR & 3D  |       | Audio & Tour |          | AI Guide &   |   | Offline-    |
| Engine   |       | Player       |          | Provenance   |   | First Store |
| (ThreeJS/|       | (expo-av)    |          | Engine       |   | (AsyncStore)|
| GLB)     |       +--------------+          +--------------+   +-------------+
+----------+              |                         |                  |
    |                     v                         v                  v
+-------------------------------------------------------------------------+
|                            SERVICES LAYER                               |
| - Location / GPS Proximity Engine                                      |
| - Curated Historical Grounding (ASI & UNESCO Records)                   |
| - Crowd Level & Weather Telemetry                                       |
+-------------------------------------------------------------------------+
```

## 📐 Architecture Components

1. **Client Tier (`APP SOURCE CODE/`):**
   - React Native & Expo Router with file-based navigation.
   - 3D rendering pipeline powered by Three.js and `@react-three/fiber` for low-poly interactive GLB models.
   - Three.js panorama spherical canvas for 360° virtual tours with interactive hot-spots.
   - Multi-language i18n support (English, Hindi, Marathi).

2. **Backend & AI Tier (`BACKEND SOURCE CODE/`):**
   - AI Heritage Guide engine grounded with ASI facts, ensuring zero hallucinations.
   - Structured JSON provenance tagging (`VERIFIED_FACT`, `ARCHAEOLOGICAL_EVIDENCE`, `LOCAL_TRADITION`).
   - Dynamic itinerary planning and smart tour generator.

3. **Data & Storage Layer:**
   - Offline packs cached locally using versioned keys (`@saarthi_v1_*`).
   - Full usability in low-connectivity or zero-signal monument sites.
