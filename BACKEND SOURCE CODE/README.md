# Backend Source Code

This directory contains the backend services, API definitions, and AI microservices supporting the **SAARTHI** application.

## 🚀 Overview

The SAARTHI backend infrastructure provides:
- **Heritage Knowledge API:** Serving authenticated archaeological records, historical facts, and verified stories.
- **AI Heritage Companion Service:** Grounded LLM integration delivering cited, factual answers to visitor queries without hallucinations.
- **Location & Nearby Exploration Service:** Geographic proximity lookups, crowd estimation, and nearby points of interest.
- **Offline Pack Generation:** Bundling site assets, 3D low-poly models, and audio guides into downloadable bundles.

## 📁 Suggested Backend Structure

```text
BACKEND SOURCE CODE/
├── api/             # REST / GraphQL endpoint controllers
├── config/          # Environment and server configuration
├── middleware/      # Authentication, rate limiting, and logging
├── models/          # Data schemas and database entities
├── services/        # AI orchestration, knowledge grounding, location
├── tests/           # Integration and unit tests
├── .env.example     # Backend-specific environment variables
├── package.json     # Node.js backend dependencies (or requirements.txt for Python)
└── README.md
```

## ⚙️ Quick Start

```bash
# Install dependencies
npm install

# Run backend service in development mode
npm run dev
```
