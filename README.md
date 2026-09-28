**SARTHI**

Discover. Understand. Experience. Explore.

SARTHI is an AI-powered heritage tourism companion designed to help travelers discover, understand and experience India's cultural heritage through personalized planning, multilingual guidance, verified information and immersive technologies.

The platform brings fragmented heritage information into a single intelligent travel experience while helping visitors discover lesser-known monuments, local culture, artisans and authentic experiences.

🏛️ Problem

Heritage tourism often involves more than simply finding a monument.

Travelers may face challenges such as:

Fragmented information across different websites and sources

Difficulty discovering lesser-known heritage destinations

Language barriers

Unverified or misleading information

Difficulty planning visits around budget, time and interests

Limited contextual information while standing at a heritage site

Lack of personalized recommendations

Difficulty discovering authentic local experiences

These challenges can reduce the quality of the visitor experience and make heritage exploration less meaningful.

💡 Our Solution

SARTHI acts as an AI-powered digital heritage companion that connects travelers with reliable contextual information and personalized travel assistance.

The platform combines:

Discover → Plan → Verify → Experience → Explore

Users can provide their:

Budget

Available time

Interests

Preferred language

Travel preferences

SARTHI can then generate a personalized heritage experience while providing contextual information at the destination.

🎯 Key Features

🤖 AI Travel Planner

Creates personalized heritage itineraries based on:

Budget

Number of days

Interests

Location

Weather

Traffic

Crowd conditions

Travel preferences

🏛️ Heritage Discovery

Helps users discover:

Famous monuments

Lesser-known heritage sites

Cultural landmarks

Local traditions

Art and crafts

Heritage experiences

✅ Verified Heritage Information

Information can be retrieved from trusted sources and organized through an AI-powered retrieval system to reduce misinformation.

📱 QR-Based Verification

Visitors can scan QR codes at supported heritage locations to access verified contextual information.

Scan QR
   ↓
Identify Heritage Site
   ↓
Retrieve Verified Information
   ↓
AI Contextual Explanation
   ↓
Explore

🌐 Multilingual Voice-First Guide

SARTHI can provide heritage information through:

Multiple languages

Voice interaction

Text explanations

Conversational queries

This makes information more accessible to travelers with different language preferences.

🥽 AR Heritage Experience

AR can be used to provide immersive contextual experiences such as:

Historical reconstructions

3D objects

Architectural explanations

Interactive heritage elements

On-site visual storytelling

🧑‍🎨 Local Artisans & Experiences

The platform can help travelers discover authentic local experiences including:

Artisans

Handicrafts

Local workshops

Cultural activities

Homestays

Traditional experiences

🗺️ Smart Itinerary

SARTHI can organize multiple destinations into a practical travel plan considering:

Location
   +
Time
   +
Budget
   +
Interests
   +
Weather
   +
Traffic
   +
Crowds
   ↓
Personalized Itinerary

🔄** User Journey**
<img width="482" height="372" alt="User-Flow" src="https://github.com/user-attachments/assets/77b5db5f-302c-4d67-977a-52ab250c17da" />


**🧠 AI Architecture**

SARTHI can use a modular AI architecture to handle different tourism tasks.

                   <img width="610" height="495" alt="System-Flow" src="https://github.com/user-attachments/assets/452a4085-b62c-4337-b70a-6b17afd29a94" />


**🛠️ Technology Stack**

<img width="463" height="507" alt="Technical-Flow" src="https://github.com/user-attachments/assets/5d106fcd-6781-4c83-98c5-644adb1ed83d" />

**AI**

Large Language Models (LLMs)

Retrieval-Augmented Generation (RAG)

Agentic workflows

Natural Language Processing

Recommendation systems

Agent Orchestration

Potential technologies include:

LangGraph

CrewAI

Custom agent orchestration

Backend

Node.js

Express.js

REST APIs

Database

MongoDB

Vector database / vector search for semantic retrieval

AR

ARCore

AR Foundation

Unity

3D heritage assets

Verification

QR Codes

Trusted-source knowledge base

Content verification pipeline

**📚 Knowledge & RAG Pipeline**

SARTHI can use a Retrieval-Augmented Generation approach to provide contextual heritage information.

Trusted Sources
      ↓
Data Collection
      ↓
Cleaning & Structuring
      ↓
Chunking
      ↓
Embeddings
      ↓
Vector Database
      ↓
User Query
      ↓
Semantic Retrieval
      ↓
LLM
      ↓
Context-Aware Response

The architecture is intended to reduce unsupported answers by grounding responses in retrieved information.

**🗺️ Personalized Planning**

SARTHI considers multiple factors before generating an itinerary.

Input

Budget
Days
Interests
Location
Language
Weather
Traffic
Crowds

Processing

User Preferences
       ↓
Destination Selection
       ↓
Site Ranking by Relevance
       ↓
Route Optimization
       ↓
Time Allocation
       ↓
Experience Recommendations

Output

Personalized Heritage Itinerary
+
Travel Route
+
Site Information
+
Local Experiences
+
Contextual Guide

🔐 Information Verification

SARTHI focuses on providing trustworthy heritage information through a verification-oriented architecture.

Potential verification layers include:

Official heritage sources

Government tourism information

Verified institutional sources

Curated cultural datasets

Source-aware RAG retrieval

QR-linked site information

The goal is to distinguish verified information from unsupported or user-generated claims.

**📱 Example User Flow**

Step 1 — Tell SARTHI What You Want

"I have 2 days.
My budget is ₹5,000.
I am interested in architecture
and local crafts."

Step 2 — SARTHI Understands the Request

The system identifies:

Available time

Budget

Interests

Destination requirements

Step 3 — Personalized Plan

SARTHI creates a practical itinerary based on available information.

Step 4 — Explore the Destination

At the heritage site the user can:

Scan a QR code

Ask questions using voice

Read contextual information

View AR experiences

Step 5 — Discover Local Culture

The user can explore:

Artisans

Crafts

Workshops

Local experiences

Homestays

**🌏 Multilingual Experience**

SARTHI is designed for India's multilingual tourism environment.

Possible language support includes:

English

Hindi

Marathi

Bengali

Tamil

Telugu

Gujarati

Kannada

Malayalam

Other regional languages

The language layer can be expanded based on deployment requirements.

**🧩 Suggested Project Structure**

SARTHI/
│
├── app/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   └── services/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server/
│
├── ai/
│   ├── agents/
│   ├── rag/
│   ├── prompts/
│   └── workflows/
│
├── ar/
│   ├── scenes/
│   ├── models/
│   └── scripts/
│
├── assets/
│
├── documentation/
│
└── README.md

🚀 Getting Started

Prerequisites

Install:

Node.js

npm

Git

Expo CLI / Expo development environment

Android Studio for Android development

Unity and required AR packages for the AR module

Clone the Repository

git clone https://github.com/YOUR-USERNAME/SARTHI.git

cd SARTHI

Install Dependencies

npm install

Start the Development Server

npx expo start

Then run the application using an Android emulator or compatible physical device.

🔑 Environment Variables

Create a .env file for local development.

Example:

API_BASE_URL=your_backend_url
LLM_API_KEY=your_api_key
DATABASE_URL=your_database_url
MAPS_API_KEY=your_maps_api_key

Never commit API keys or private credentials to GitHub.

🔮 Future Scope

SARTHI can be expanded with:

Advanced AI travel agents

Real-time crowd intelligence

Dynamic itinerary modification

More Indian languages

Offline heritage information packs

Advanced AR historical reconstruction

3D digital heritage models

Verified artisan marketplace

Personalized cultural recommendations

Heritage accessibility assistance

Voice-based navigation

Smart ticket and time-slot integration

Digital heritage passports

🌱 Expected Impact

SARTHI aims to make heritage tourism:

Personalized → Accessible → Verified → Immersive → Meaningful

The platform can help travelers move beyond simply visiting famous monuments and instead understand the historical context and discover local cultural experiences.

🎯 Target Users

SARTHI can serve:

Domestic tourists

International tourists

Students

Heritage enthusiasts

Families

Solo travelers

Cultural researchers

Tour operators

Heritage organizations

Tourism authorities

🏛️ Potential Use Cases

Heritage Exploration

Discover and understand historical monuments.

Educational Tourism

Provide students with contextual historical information.

Cultural Tourism

Connect visitors with local crafts and traditions.

Smart Travel Planning

Create itineraries according to individual requirements.

On-Site Digital Guide

Provide contextual information while the visitor is physically at a heritage site.

⭐ Why SARTHI?

Traditional tourism applications often focus on maps, tickets or basic destination information.

SARTHI focuses on the complete heritage journey:

DISCOVER
   ↓
PLAN
   ↓
VERIFY
   ↓
TRAVEL
   ↓
EXPERIENCE
   ↓
UNDERSTAND
   ↓
EXPLORE

👨‍💻 Project

Project: SARTHI
Domain: AI + Heritage Tourism
Platform: Mobile Application
Core Technologies: AI + RAG + Agentic Workflows + AR + QR
Focus: Personalized and trustworthy heritage experiences

📄 License

This project is currently intended for educational, research and prototype development.

Add the appropriate open-source license before public distribution.

⭐ Support

If you find SARTHI useful, consider giving the repository a ⭐ on GitHub.

SARTHI — Your Intelligent Companion for India's Heritage.
