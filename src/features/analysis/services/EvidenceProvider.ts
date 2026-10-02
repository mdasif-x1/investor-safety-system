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

    // 1. Evidence evaluation (explicitly communicating unverified / prototype status)
    evidenceItems.push({
      id: "ev_sebi_registry",
      sourceName: "Official SEBI Intermediary Registry Search",
      sourceType: "OFFICIAL_REGISTRY",
      status: "UNVERIFIED",
      explanation: "The submitted message claims SEBI registration. This prototype has not independently verified the registration status of the sender.",
      sourceUrl: "https://scores.sebi.gov.in/",
      checkedAt: new Date().toISOString(),
    });

    evidenceItems.push({
      id: "ev_guaranteed_rule",
      sourceName: "SEBI Prohibition of Guaranteed Returns Regulation",
      sourceType: "OFFICIAL_GUIDANCE",
      status: "CONTRADICTED",
      explanation: "SEBI advisory regulations explicitly prohibit registered intermediaries from offering guaranteed or fixed returns on stock investments.",
      sourceUrl: "https://investor.sebi.gov.in/",
      checkedAt: new Date().toISOString(),
    });

    // 2. Uncertainty Items (explaining unknown aspects)
    uncertaintyItems.push({
      id: "unc_identity",
      title: "Sender Identity Unresolved",
      explanation: "The message provides a claimed name or channel title, but the submitted text alone does not prove who controls the account.",
      reason: "Private messaging channels (Telegram/WhatsApp) mask account ownership.",
    });

    uncertaintyItems.push({
      id: "unc_registration",
      title: "Registration Credentials Unverified",
      explanation: "No live query was executed against the official SEBI Research Analyst database in this prototype analysis.",
      reason: "Full live database integration requires SEBI API verification endpoints.",
    });

    uncertaintyItems.push({
      id: "unc_performance",
      title: "Historical Return Claims Unsupported",
      explanation: "The message promises high percentage returns, but no verified historical trade logs were provided.",
      reason: "Unverified return claims are commonly used to attract inexperienced investors.",
    });

    // 3. Categorized Safe Actions
    recommendedSafeActions.push({
      id: "sa_do_now_1",
      title: "Do Not Transfer Funds Yet",
      description: "Refrain from paying joining fees, deposit amounts, or transferring funds via UPI to unverified channels.",
      actionType: "REFRAIN_FROM_PAYMENT",
      priority: "DO_NOW",
    });

    recommendedSafeActions.push({
      id: "sa_do_now_2",
      title: "Do Not Share Credentials",
      description: "Never share OTPs, UPI PINs, banking passwords, or install remote-access applications.",
      actionType: "REFRAIN_FROM_PAYMENT",
      priority: "DO_NOW",
    });

    recommendedSafeActions.push({
      id: "sa_verify_1",
      title: "Verify SEBI Registration Independently",
      description: "Search official SEBI SCORES portal before trusting any claim of SEBI approval.",
      actionType: "SEBI_LOOKUP",
      priority: "VERIFY_BEFORE_ACTING",
      externalLink: "https://scores.sebi.gov.in/",
    });

    recommendedSafeActions.push({
      id: "sa_verify_2",
      title: "Preserve Message Evidence",
      description: "Take unedited screenshots showing channel names and phone numbers in case you need to file a report.",
      actionType: "PRESERVE_EVIDENCE",
      priority: "VERIFY_BEFORE_ACTING",
    });

    recommendedSafeActions.push({
      id: "sa_paid_1",
      title: "Report Financial Fraud Immediately",
      description: "If money has already moved, immediately notify your bank and lodge a complaint on the Cybercrime Portal.",
      actionType: "REPORT_SUSPICIOUS_CONTENT",
      priority: "IF_ALREADY_PAID",
      externalLink: "https://cybercrime.gov.in/",
    });

    return { evidenceItems, uncertaintyItems, recommendedSafeActions };
  }
}