import { Claim, EvidenceItem, UncertaintyItem, SafeAction } from "@/types/analysis";

export interface IEvidenceProvider {
  evaluateEvidenceAndUncertainty(claims: Claim[]): {
    evidenceItems: EvidenceItem[];
    uncertaintyItems: UncertaintyItem[];
    recommendedSafeActions: SafeAction[];
  };
}

export class MockEvidenceProvider implements IEvidenceProvider {
  evaluateEvidenceAndUncertainty(claims: Claim[]): {
    evidenceItems: EvidenceItem[];
    uncertaintyItems: UncertaintyItem[];
    recommendedSafeActions: SafeAction[];
  } {
    const evidenceItems: EvidenceItem[] = [];
    const uncertaintyItems: UncertaintyItem[] = [];
    const recommendedSafeActions: SafeAction[] = [];

    // 1. Evidence Items (Strictly honest semantics - no fake timestamps or fake contradiction)
    evidenceItems.push({
      id: "ev_sebi_registry",
      sourceName: "Official SEBI Intermediary Database",
      sourceType: "OFFICIAL_GUIDANCE",
      status: "UNVERIFIED",
      explanation: "The message claims SEBI registration. This prototype did not perform a live registry lookup against SEBI databases.",
      sourceUrl: "https://scores.sebi.gov.in/",
      scope: "Prototype scope: Live database lookup endpoint not queried.",
    });

    evidenceItems.push({
      id: "ev_guaranteed_rule",
      sourceName: "SEBI Advisory Code of Conduct & Regulations",
      sourceType: "OFFICIAL_GUIDANCE",
      status: "CONTRADICTED",
      explanation: "SEBI regulations prohibit registered intermediaries from offering guaranteed or fixed returns on stock investments.",
      sourceUrl: "https://investor.sebi.gov.in/",
      scope: "Regulatory Policy Guidance",
    });

    // 2. Uncertainty Items (Explaining unresolved aspects)
    uncertaintyItems.push({
      id: "unc_identity",
      title: "Sender Identity Unresolved",
      explanation: "The message contains a claimed identity or group title, but the submitted content alone does not establish who controls the account.",
      reason: "Private messaging channels (Telegram/WhatsApp) mask account ownership.",
    });

    uncertaintyItems.push({
      id: "unc_registration",
      title: "Registration Credentials Unverified",
      explanation: "No live database query was executed against the official SEBI Research Analyst register in this prototype check.",
      reason: "Full live database integration requires SEBI verification API endpoints.",
    });

    uncertaintyItems.push({
      id: "unc_performance",
      title: "Historical Return Claims Unsupported",
      explanation: "The message promises high percentage returns, but no independent trade performance logs were provided.",
      reason: "Unverified return claims are commonly used in financial advisory marketing.",
    });

    // 3. Safe Actions with correct semantics (DO_NOT_SHARE_CREDENTIALS separated from payment)
    recommendedSafeActions.push({
      id: "sa_do_now_1",
      title: "Do Not Transfer Money Yet",
      description: "Refrain from making UPI transfers or paying joining fees to unverified advisory channels.",
      actionType: "REFRAIN_FROM_PAYMENT",
      priority: "DO_NOW",
    });

    recommendedSafeActions.push({
      id: "sa_do_now_2",
      title: "Do Not Share Credentials or PINs",
      description: "Never share your banking passwords, OTPs, or UPI PINs with anyone claiming to be a financial advisor.",
      actionType: "DO_NOT_SHARE_CREDENTIALS",
      priority: "DO_NOW",
    });

    recommendedSafeActions.push({
      id: "sa_verify_1",
      title: "Verify Registration Independently",
      description: "Search official SEBI public portals directly to check if the entity is genuinely registered.",
      actionType: "SEBI_LOOKUP",
      priority: "VERIFY_BEFORE_ACTING",
      externalLink: "https://scores.sebi.gov.in/",
    });

    recommendedSafeActions.push({
      id: "sa_verify_2",
      title: "Preserve Message Evidence",
      description: "Keep original unedited screenshots showing group names and numbers in case you need to file a formal complaint.",
      actionType: "PRESERVE_EVIDENCE",
      priority: "VERIFY_BEFORE_ACTING",
    });

    recommendedSafeActions.push({
      id: "sa_paid_1",
      title: "Report Financial Fraud Immediately",
      description: "If money has already moved, immediately notify your bank and lodge a complaint on the National Cybercrime Reporting Portal.",
      actionType: "REPORT_SUSPICIOUS_CONTENT",
      priority: "IF_ALREADY_PAID",
      externalLink: "https://cybercrime.gov.in/",
    });

    return { evidenceItems, uncertaintyItems, recommendedSafeActions };
  }
}