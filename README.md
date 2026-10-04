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

## 🏛️ Architecture & Tech Stack

```text
USER / JUDGE BROWSER
        │
        ▼ HTTPS
VERCEL (Next.js 14 App Router Frontend)
   (Client-Side WASM OCR via Tesseract.js)
        │
        ▼ HTTPS REST API (POST /api/v1/analysis)
RENDER (Dockerized Spring Boot 3.3.4 / Java 21 Backend)
   ├── Java 21 Deterministic Safety & NLU Pattern Engine
   ├── Risk Rules R01–R05 & Educational Negation Rules
   └── Authoritative Evidence Provider Boundary (SCORES Link Provider)
```

- **Frontend**: Next.js 14 (App Router), TypeScript (Strict), Tailwind CSS, Lucide React, Tesseract.js (Client-Side WASM OCR).
- **Backend**: Spring Boot 3.3.4, Java 21, Maven, Docker Multi-Stage Build, Embedded Tomcat.
- **Design Philosophy**: Calm, trustworthy, institutional public safety visual system (warm off-white background, deep institutional navy typography, restrained saffron accents).

---

## 🐳 Docker & Backend Production Setup

The Spring Boot backend is fully Dockerized for Render or container environments.

### 1. Build & Run Backend Container Locally
```bash
# Build Docker image
docker build -t sangyan-backend ./backend

# Run container on port 8080
docker run -d -p 8080:8080 -e PORT=8080 sangyan-backend

# Verify health endpoint
curl http://localhost:8080/api/v1/health
```

### 2. Deploying Backend to Render
1. Create a **New Web Service** on Render.
2. Select repository `mdasif-x1/investor-safety-system`.
3. Set **Language**: `Docker`.
4. Set **Root Directory**: `backend/`.
5. Set **Dockerfile Path**: `backend/Dockerfile`.
6. Add Environment Variable:
   - `APP_FRONTEND_ALLOWED_ORIGIN` = `https://investor-safety-system.vercel.app`
7. Render will automatically bind to its internal `$PORT`.

---

## 🌐 Frontend Vercel Deployment Setup

The frontend is deployed to Vercel:
`https://investor-safety-system.vercel.app/`

### Vercel Environment Variables
Set the following environment variable in Vercel project settings:
```text
NEXT_PUBLIC_API_BASE_URL=https://<your-render-backend-domain>
```
*Note: Do NOT append `/api/v1/analysis` to `NEXT_PUBLIC_API_BASE_URL`. Specify only the origin domain.*

---

## 💻 Local Development Setup

```bash
# 1. Start Spring Boot Backend Locally
cd backend
mvn spring-boot:run

# 2. Start Next.js Frontend Locally
npm install
npm run dev

# 3. Comprehensive Verification Commands
npm run type-check   # TypeScript strict validation
npm run build        # Production Next.js build validation
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
