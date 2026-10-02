# SANGYAN Investor Safety System

An institutional public-interest safety copilot built for the **SANGYAN Investor Resilience Hackathon**, organized by SNTC, IIT (BHU) Varanasi in collaboration with **SEBI** and **NSDL**.

- **Primary Track**: Track A — Digital Fraud & Scam Resilience
- **Secondary Track**: Track E — Misinformation & Financial Content Literacy

---

## 🎯 Purpose & Core Principle

**"Before money or action moves, check what you are seeing."**

The system empowers first-time and inexperienced digital investors (especially in Tier-2/3 cities) to inspect financial messages, claims, and screenshots received on WhatsApp, Telegram, or social media. It identifies warning signals, verifies official SEBI/NSDL registries, explains uncertainty, and guides users toward safer next steps.

It is **NOT** an investment advisor. It never provides buy/sell/hold advice, stock predictions, or arbitrary numeric scam scores (e.g. "97.4% scam").

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with Semantic CSS Tokens
- **Icons**: Lucide React
- **Design Philosophy**: Calm, trustworthy, institutional, anti-AI visual language (no dark neon gradients, glowing borders, or cyberpunk SaaS gimmicks).

---

## 🚀 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Perform type-checking
npm run type-check

# 4. Production build validation
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the result.

---

## 📁 Project Structure

```
src/
├── app/                  # Route Pages (Golden Journey)
│   ├── layout.tsx        # Global Layout & Metadata
│   ├── page.tsx          # Home Page (Overview & Product Preview)
│   ├── check/            # Step 1: Content Submission Input
│   └── result/           # Step 3: Analysis & Evidence Report
├── components/
│   ├── ui/               # Design System Primitives (Button, Card, Badge, Input, Container)
│   └── layout/           # Application Shell (Header, Footer, PageShell)
├── config/
│   └── site.ts           # Central Brand & Navigation Configuration
└── types/
    └── analysis.ts       # Backend-Ready Analysis & Evidence Contracts
```

