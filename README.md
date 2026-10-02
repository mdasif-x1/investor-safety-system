# SANGYAN Investor Safety System

An institutional public-interest investor resilience system built for the **SANGYAN Investor Resilience Hackathon**, organized by SNTC, IIT (BHU) Varanasi in collaboration with **SEBI** and **NSDL**.

- **Primary Track**: Track A — Digital Fraud & Scam Resilience
- **Secondary Track**: Track E — Misinformation & Financial Content Literacy

---

## 🎯 Purpose & Core Principle

> **"Before money or action moves, check what you are seeing."**

The system empowers first-time and inexperienced digital investors (especially in Tier-2/3 cities) to inspect financial messages, claims, and screenshots received on WhatsApp, Telegram, or social media. It identifies warning signals, verifies official SEBI/NSDL registries, explains uncertainty, and guides users toward safer next steps.

It is **NOT** an investment advisor. It never provides buy/sell/hold advice, stock predictions, or arbitrary numeric scam scores (e.g., "97.4% scam").

---

## 🏛️ Locked Architecture & Tech Stack

```text
Judge / Investor Browser
        │
        ▼ HTTPS
Public Next.js 14 App Router (Vercel)
   (Client-Side WASM OCR via Tesseract.js)
        │
        ▼ HTTPS REST API (POST /api/v1/analysis)
Public Spring Boot 3.3.4 Backend (Railway / Render)
   ├── Java 21 Deterministic Safety & NLU Pattern Engine
   ├── Risk Rules R01–R05 & Educational Negation Rules
   └── Authoritative Evidence Provider Boundary (SCORES Link Provider)
```

- **Frontend**: Next.js 14 (App Router), TypeScript (Strict), Tailwind CSS, Lucide React, Tesseract.js (Client-Side WASM OCR).
- **Backend**: Spring Boot 3.3.4, Java 21, Maven, Embedded Tomcat, RESTful APIs.
- **Design Philosophy**: Calm, trustworthy, institutional, anti-AI visual language (no dark neon gradients, glowing borders, or cyberpunk SaaS gimmicks).

---

## 🌐 Public Deployment & Environment Configuration

### Frontend Environment Variables (`.env.production`)
- `NEXT_PUBLIC_API_BASE_URL`: Public HTTPS backend URL (e.g., `https://sangyan-backend.up.railway.app`)

### Backend Environment Variables (`application.properties` / Env Vars)
- `APP_FRONTEND_ALLOWED_ORIGIN`: Public HTTPS frontend URL (e.g., `https://sangyan-investor-safety.vercel.app`)

---

## 🚀 Deployment Instructions

### 1. Backend Deployment (Railway / Render / Heroku)
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- **Java Version**: 21
- **Health Check**: `GET /api/v1/health` -> `HTTP 200 OK`

### 2. Frontend Deployment (Vercel / Netlify)
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x or 20.x

---

## 💻 Local Development Setup

```bash
# 1. Start Spring Boot Backend
cd backend
mvn spring-boot:run

# 2. Start Next.js Frontend
npm install
npm run dev

# 3. Validation Suites
npm run type-check   # TypeScript validation
npm run build        # Production Next.js build
mvn clean test       # 21/21 Spring Boot Integration Tests
```

---

## 📋 Judge-Facing Live Demo Runbook (3–5 Minutes)

1. **0:00–0:30 (Problem & Vision)**: Open `/`. Explain Tier-2/3 investor vulnerability and why binary scam scoring fails.
2. **0:30–1:00 (Submission)**: Open `/check`. Click **Suspicious WhatsApp Tip** preset or paste synthetic message.
3. **1:00–2:30 (5-Stage Analysis Walkthrough)**:
   - **Claims**: Deconstructed statements extracted from input.
   - **Risk Signals**: High-risk patterns matched (Guaranteed return, payment demand, SEBI identity claim, Telegram redirect).
   - **Evidence**: Explains unverified status and missing entity registration number.
   - **Uncertainty**: Transparently communicates system confidence limits.
   - **Safe Action**: Actionable defensive steps (Refrain from payment, preserve evidence, verify SEBI SCORES portal).
4. **2:30–3:00 (Hinglish Bharat-First Demo)**: Return to `/check`. Click **Hinglish WhatsApp Tip** preset (`"Bhai SEBI registered hu. 25% fix return..."`) to demonstrate vernacular pattern recognition.

---

## 🔒 Guardrails & Honest Boundaries

- **Performance**: *Performance has not been formally benchmarked.*
- **SEBI Verification**: *Official SEBI SCORES portal link is provided for manual check; live programmatic SEBI API is not implemented.*
- **OCR Engine**: *Client-side WASM OCR processes English screenshots locally in the browser without server upload.*
- **Privacy**: *Submitted content is processed ephemerally in memory and is never persisted to a database.*

