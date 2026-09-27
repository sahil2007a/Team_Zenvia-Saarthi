# 🪔 SAARTHI (सारथी) — Team Zenvia

> **AI & AR-Powered Cultural Heritage Exploration Platform**  
> *"From where you are, to what it means."*

[![Expo SDK](https://img.shields.io/badge/Expo-SDK_57-000020.svg?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_API-339933.svg?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Connected-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black.svg?style=flat&logo=three.js)](https://threejs.org/)

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Repository Folder Structure](#-repository-folder-structure)
3. [Prerequisites](#-prerequisites)
4. [Environment Setup (.env)](#-environment-setup-env)
5. [Step-by-Step Run Commands](#-step-by-step-run-commands)
   - [Running the Backend Server](#1-running-the-backend-server)
   - [Running the Mobile App](#2-running-the-mobile-app)
6. [Core Features & Architecture](#-core-features--architecture)
   - [Augmented Reality (AR) & 3D Studio](#1-augmented-reality-ar--3d-studio)
   - [360° Virtual Panoramic Tours](#2-360-virtual-panoramic-tours)
   - [Grounded AI Heritage Guide](#3-grounded-ai-heritage-guide)
   - [Smart Cultural Itinerary Planner](#4-smart-cultural-itinerary-planner)
   - [Multilingual & Offline-First Design](#5-multilingual--offline-first-design)
7. [API Endpoints Reference](#-api-endpoints-reference)
8. [Testing & Verification](#-testing--verification)

---

## 🌟 Project Overview

**SAARTHI** is an intelligent cultural companion designed to bridge the gap between visiting historic monuments and deeply understanding their civilizational stories. Built with an offline-first architecture, SAARTHI blends **real-time Augmented Reality (AR)**, **interactive 3D inspection**, **360° immersive virtual tours**, and a **provenance-grounded AI guide** citing official Archaeological Survey of India (ASI) and UNESCO records.

---

## 📁 Repository Folder Structure

The repository is organized into distinct, modular folders:

```text
SAARTHI/
│
├── APP SOURCE CODE/           # Cross-platform Mobile & Web Frontend (React Native & Expo)
│   ├── app/                   # Expo Router file-based pages (tabs, site details, AR experience)
│   │   ├── (tabs)/            # Main navigation tabs (Explore, Guide, Planner, Profile)
│   │   ├── site/[id].tsx      # Monument detail view with history, stories, facilities, and AR banner
│   │   ├── site/[id]/         # Monument immersive experience routing (AR & Virtual Tours)
│   │   ├── onboarding.tsx     # Personalized traveler onboarding flow
│   │   └── _layout.tsx        # Root navigation stack and theme provider
│   ├── assets/                # App icons, splash screens, and 3D GLB monument models
│   ├── components/            # Reusable UI & Feature components
│   │   ├── ar/                # Augmented Reality engine (ARViewer, ModelPlacement, PlaneDetection)
│   │   ├── virtual-tour/      # Three.js 360° panoramic canvas & interactive hotspot pins
│   │   ├── guide/             # Conversational AI interface with citation cards & provenance badges
│   │   ├── heritage/          # Monument cards, carousels, timeline views, site schematics
│   │   └── common/            # Design system buttons, badges, modals, and headers
│   ├── data/                  # Localized datasets, 3D Base64 models (India Gate, Qutub Minar), tours
│   ├── services/              # Axios API client, authentication service, AI service, weather
│   ├── store/                 # Zustand global state (user auth, audio player, offline sync)
│   └── package.json           # Frontend dependencies & start scripts
│
├── BACKEND SOURCE CODE/       # Backend REST API Server (Node.js, Express, MongoDB Atlas)
│   ├── config/                # Database connection manager (Mongoose Atlas client)
│   ├── controllers/           # Auth controllers (register, login, getProfile)
│   ├── middleware/            # JWT verification & request validation middleware
│   ├── models/                # Mongoose database schemas (User schema with bcrypt hashing)
│   ├── routes/                # Express API routes (/api/auth, /api/health)
│   ├── tests/                 # Supertest API endpoint test suite
│   ├── server.js              # Server entry point with graceful shutdown & error handling
│   ├── .env                   # Live environment configuration with MongoDB Atlas connection string
│   └── package.json           # Backend dependencies & dev scripts
│
├── App Demo/                  # Application walkthrough videos, recordings, and screenshots
├── Architectures/             # System diagrams, component architecture, and WebAR pipeline blueprints
├── Documentation/             # Comprehensive PRD, TRD, System Design, and User Flow specifications
├── Research/                  # ASI archaeological literature, historical research, and field studies
├── env.example                # Unified environment variables template
├── .gitignore                 # Standard ignore file for node_modules, build caches, and secrets
└── README.md                  # Complete project documentation and run guide
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have the following installed on your computer:

1. **Node.js** (v18.0.0 or higher recommended) — [Download Node.js](https://nodejs.org/)
2. **npm** (v9.0.0 or higher) or **yarn**
3. **Expo Go app** on your Android or iOS mobile phone (available free on Google Play Store & Apple App Store)
4. *(Optional for local mobile development)*: Android Studio (for Android Emulator) or Xcode (for macOS iOS Simulator).

---

## 🔐 Environment Setup (.env)

The repository includes a template file: `env.example`.

### 1. Backend Environment Setup:
The backend `.env` file is located at `BACKEND SOURCE CODE/.env`. It is pre-configured with the live MongoDB Atlas cluster:

```env
PORT=5001
MONGODB_URI=mongodb://sahilramteke95_db_user:<password>@ac-n1xkmag-shard-00-00.qdlafz5.mongodb.net:27017,ac-n1xkmag-shard-00-01.qdlafz5.mongodb.net:27017,ac-n1xkmag-shard-00-02.qdlafz5.mongodb.net:27017/?ssl=true&replicaSet=atlas-7yx49v-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=saarthi_super_secure_jwt_secret_key_2026_zenvia
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 🚀 Step-by-Step Run Commands

Follow these simple steps in your terminal to start the platform:

### 1. Running the Backend Server

Open your first terminal window:

```bash
# Step 1: Navigate to the Backend folder
cd "BACKEND SOURCE CODE"

# Step 2: Install dependencies (only needed the first time)
npm install

# Step 3: Start the server in development mode (with auto-reload)
npm run dev
```

> **Expected Terminal Output:**
> ```text
> [SAARTHI Backend] Server running in development mode on port 5001
> [MongoDB Atlas] Connected successfully to host: ac-n1xkmag-shard-00-00.qdlafz5.mongodb.net
> ```

To verify the backend is running, open your browser or run:
```bash
curl http://localhost:5001/api/health
```

---

### 2. Running the Mobile App

Open a second terminal window:

```bash
# Step 1: Navigate to the App folder
cd "APP SOURCE CODE"

# Step 2: Install dependencies (only needed the first time)
npm install

# Step 3: Start the Expo development server
npm start
# OR
npm run dev
```

> **Expo Controls Menu:**
> - 📱 **On Mobile Phone:** Open the **Expo Go** app on your phone, tap **Scan QR code**, and scan the QR code displayed in your terminal. Both your computer and phone must be on the same Wi-Fi network.
> - 🌐 **In Web Browser:** Press `w` in the terminal to launch the app directly in your web browser.
> - 🤖 **On Android Emulator:** Press `a` in the terminal to launch on a running Android emulator.
> - 🍎 **On iOS Simulator:** Press `i` in the terminal (macOS only).

---

## 🏛️ Core Features & Architecture

### 1. Augmented Reality (AR) & 3D Studio
- **3D Monument Studio:** Full 360° orbit rotation, pinch-to-scale, pan, and lighting for monuments (India Gate, Qutub Minar).
- **Live Camera Augmented Reality:**
  1. Open any monument page (e.g., India Gate or Qutub Minar) and tap **"VIEW IN AR"**.
  2. Tap the **"View in AR"** button at the bottom.
  3. The phone prompts for **Camera Permission**.
  4. Real-time **Plane Detection** scans the surface with an interactive reticle and guidance card.
  5. The 3D monument anchors securely onto the floor/ground in front of you with realistic ground shadows.
  6. Tap **"3D Studio"** to toggle back to the inspection studio anytime.
- **Zero-Latency Offline Models:** Optimized low-poly GLTF 2.0 binaries converted into base64 data URIs for instant rendering with zero network delay.

### 2. 360° Virtual Panoramic Tours
- High-resolution equirectangular spherical views powered by Three.js.
- Interactive hotspots indicating architectural highlights (e.g., corbelled balconies of Qutub Minar, central stupa of Deekshabhoomi).
- Integrated spatial audio narration.

### 3. Grounded AI Heritage Guide
- Conversational chat powered by contextual knowledge retrieval.
- **Provenance Badges:** Every statement is tagged with verified provenance:
  - `VERIFIED_FACT`: Directly backed by Archaeological Survey of India (ASI) records.
  - `ARCHAEOLOGICAL_EVIDENCE`: Excavation finds and carbon dating data.
  - `LOCAL_TRADITION`: Documented oral histories and folklore.

### 4. Smart Cultural Itinerary Planner
- Generates personalized travel itineraries based on:
  - Available visit duration (half-day, full-day, multi-day).
  - Accessibility needs (wheelchair friendly, minimal walking).
  - Traveler interests (architecture, mythology, photography, family-friendly).
- Real-time crowd density indicator and optimal visiting hours.

### 5. Multilingual & Offline-First Design
- **Languages Supported:** English, Hindi (हिन्दी), and Marathi (मराठी).
- Switch language on-the-fly from the Profile tab.
- Downloadable offline site packs enable full access to monument maps, stories, and 3D models without internet connectivity.

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:5001/api`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Health check & MongoDB Atlas status | No |
| `POST` | `/auth/register` | Register new user (name, email, password) | No |
| `POST` | `/auth/login` | Login user & receive JWT token | No |
| `GET` | `/auth/profile` | Fetch authenticated user profile | Yes (Bearer Token) |

---

## 🧪 Testing & Verification

### Running Backend Tests
```bash
cd "BACKEND SOURCE CODE"
npm test
```
*Executes all 8 integration tests covering health checks, user registration, JWT generation, password validation, and profile retrieval against live MongoDB Atlas.*

### Running Frontend Typechecks
```bash
cd "APP SOURCE CODE"
npx tsc --noEmit
```
*Validates 100% type safety across all React Native screens, components, and services with zero TypeScript errors.*

---

## 👥 Team Zenvia

- **Sahil Ramteke** — Project Lead & Full Stack / AR Development
- **Team Zenvia** — Research, System Architecture & Cultural Grounding
