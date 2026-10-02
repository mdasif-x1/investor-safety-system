# PHASE 3 IMPLEMENTATION REPORT — EVIDENCE-AWARE ANALYSIS & UNCERTAINTY LAYER

---

## 1. Executive Summary
Phase 3 transforms the SANGYAN Investor Safety Copilot into an **Evidence-Aware Investor Safety Report**. The analysis output cleanly separates five fundamental layers:
1. **WHAT THE MESSAGE CLAIMS** (Explicit claims extracted directly from message text).
2. **WHAT WE DETECTED** (Rule-matched warning signals based on SEBI regulatory patterns).
3. **WHAT WE CAN VERIFY** (Transparent registry status with explicit "Unverified" & "Contradicts" statuses).
4. **WHAT REMAINS UNKNOWN / UNCERTAIN** (Explicit unresolved items regarding sender identity & performance).
5. **WHAT YOU CAN SAFELY DO** (Actions prioritized by urgency before money moves).

---

## 2. Product Behavior & Trust Safeguards
- **No Scam Scores**: UI refrains from arbitrary scam probabilities (e.g. "97.4% scam") and communicates semantic warning statuses (*"Several Warning Signs Detected"*).
- **Zero Evidence Fabrication**: When official verification endpoints are unavailable, status is explicitly marked as `UNVERIFIED` or `INSUFFICIENT_INFORMATION` rather than fabricating fake SEBI confirmations.
- **Source Snippet Mapping**: Extracted claims display exact source text snippets (e.g., `"Guaranteed 25% monthly returns"`) to ensure transparent explainability.

---

## 3. Architecture & Data Model Changes
```
[User Submission (Text/Image)]
             │
             ▼
      [TextExtractor]  ─── Normalization
             │
             ▼
  [RuleBasedClaimExtractor] ── Explicit Claims (Category & Source Snippets)
             │
             ▼
        [RiskEngine]   ── Context-Aware Rule Evaluation (R01-R05)
             │
             ▼
   [MockEvidenceProvider] ── Transparent Evidence & Uncertainty Item Generation
             │
             ▼
   [MockAnalysisService] ── Memory Session Store
             │
             ▼
    [/analysis/[id] View] ── 5-Layer Evidence-Aware Report Page
```

### Data Model Enhancements (`src/types/analysis.ts`):
- `Claim`: Added `sourceSnippet`, `category` taxonomy, and `evidenceStatus`.
- `EvidenceItem`: Enhanced with `sourceType`, `checkedAt`, `explanation`, and `sourceUrl`.
- `UncertaintyItem`: Structured item detailing title, explanation, and reason for unresolved facts.
- `SafeAction`: Priority tiers (`DO_NOW`, `VERIFY_BEFORE_ACTING`, `IF_ALREADY_PAID`).

---

## 4. Implemented Risk Rules & Context Precision
- **R01 — Guaranteed Return Language**: Flags assurances of 100%/fixed monthly returns. Context-aware negation filter suppresses false positives on disclaimers (e.g. *"Guaranteed returns are not promised"*).
- **R02 — Artificial Urgency Pressure**: Flags deadline pressure tactics (*"limited seats", "act fast"*).
- **R03 — Direct Upfront Payment Request**: Flags requests for monetary transfer or UPI deposits.
- **R04 — Unverified Regulatory Identity Claim**: Flags SEBI registration claims requiring official register lookup.
- **R05 — Off-Platform Group Redirection**: Flags redirection to private Telegram/WhatsApp groups.

---

## 5. Routes Updated
- `/check` — Enhanced input page with sample presets for demo testing.
- `/analysis/[id]` — Reworked 5-layer Evidence-Aware Investor Safety Report with expandable recovery guidance.

---

## 6. Responsive & Accessibility Validation
- **Viewports Validated**: `360px`, `390px`, `768px`, `1024px`, `1280px`, `1440px+`.
- **Layout Integrity**: Card stacking on mobile, readable claim snippets, zero horizontal overflow, visible focus rings.

---

## 7. Guardrail Compliance
- [x] No investment recommendations (buy/sell/hold).
- [x] No price predictions.
- [x] No arbitrary numeric scam probability.
- [x] No fake SEBI endorsements or fabricated verification claims.
- [x] Zero collection of OTPs, passwords, or personal identity documents.

---

## 8. Technical Verification Results
- **TypeScript Check (`npm run type-check`)**: **PASS** (0 errors).
- **Production Build (`npm run build`)**: **PASS** (Static & dynamic routes compiled successfully).

---

## 9. Known Limitations
- Evidence registry lookups are currently evaluated through `MockEvidenceProvider` (real Spring Boot & live API connections scheduled for later backend integration phases).
- Screenshot extraction is currently mocked via `TextExtractor`.

---

## 10. Recommended Phase 4 Starting Point
Proceed to **PHASE 4 — LATENCY OPTIMIZATION, UX HARDENING & BACKEND INTEGRATION PREPARATION**:
Refine fast-path (<1s preliminary warning signs) vs deep-path verification loading state UI and prepare API client hooks for Spring Boot REST API integration.
