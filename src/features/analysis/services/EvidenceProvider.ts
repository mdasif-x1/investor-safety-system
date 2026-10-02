import { Claim, RiskSignal, EvidenceItem, UncertaintyItem, SafeAction } from "@/types/analysis";

export interface IEvidenceProvider {
  evaluateEvidenceAndUncertainty(claims: Claim[], riskSignals: RiskSignal[]): {
    evidenceItems: EvidenceItem[];
    uncertaintyItems: UncertaintyItem[];
    recommendedSafeActions: SafeAction[];
  };
}

export class MockEvidenceProvider implements IEvidenceProvider {
  evaluateEvidenceAndUncertainty(claims: Claim[], riskSignals: RiskSignal[]): {
    evidenceItems: EvidenceItem[];
    uncertaintyItems: UncertaintyItem[];
    recommendedSafeActions: SafeAction[];
  } {
    const evidenceItems: EvidenceItem[] = [];
    const uncertaintyItems: UncertaintyItem[] = [];
    const recommendedSafeActions: SafeAction[] = [];

    const hasRegulatoryClaim = claims.some((c) => c.category === "REGULATORY_IDENTITY");
    const hasGuaranteedReturnClaim = claims.some((c) => c.category === "GUARANTEED_RETURN");
    const hasPaymentClaim = claims.some((c) => c.category === "PAYMENT_REQUEST");
    const hasOffPlatformClaim = claims.some((c) => c.category === "OFF_PLATFORM_INVITATION");

    const hasPaymentSignal = riskSignals.some((s) => s.code === "DIRECT_PAYMENT_REQUEST");

    // 1. Condition-Dependent Evidence (Only present relevant evidence for detected claims)
    if (hasRegulatoryClaim) {
      evidenceItems.push({
        id: "ev_sebi_registry",
        sourceName: "Official SEBI Public Guidance",
        sourceType: "OFFICIAL_GUIDANCE",
        status: "UNVERIFIED",
        explanation: "The message claims SEBI registration or regulatory approval. Independent verification through official SEBI public sources is required before acting.",
        sourceUrl: "https://scores.sebi.gov.in/",
        scope: "Independent public lookup required; prototype did not query live registry endpoints.",
      });

      uncertaintyItems.push({
        id: "unc_registration",
        title: "Registration Status Unverified",
        explanation: "The message claims regulatory approval, but no live database lookup was performed in this prototype check.",
        reason: "Official registry validation requires live query against authoritative SEBI registers.",
      });

      recommendedSafeActions.push({
        id: "sa_verify_reg",
        title: "Verify Registration Independently",
        description: "Open official SEBI public registers directly to confirm if the entity or advisor is genuinely registered.",
        actionType: "SEBI_LOOKUP",
        priority: "VERIFY_BEFORE_ACTING",
        externalLink: "https://scores.sebi.gov.in/",
      });
    }

    if (hasGuaranteedReturnClaim) {
      evidenceItems.push({
        id: "ev_guaranteed_rule",
        sourceName: "SEBI Advisory Code of Conduct & Regulations",
        sourceType: "OFFICIAL_GUIDANCE",
        status: "UNVERIFIED",
        explanation: "SEBI advisory regulations explicitly prohibit registered intermediaries from offering guaranteed or fixed returns on stock market investments.",
        sourceUrl: "https://investor.sebi.gov.in/",
        scope: "Regulatory policy guidance for investors.",
      });

      uncertaintyItems.push({
        id: "unc_performance",
        title: "Historical Return Claims Unsupported",
        explanation: "The message promises high percentage returns, but no independent trade performance logs or verified audits were provided.",
        reason: "Unverified return promises are common in advisory marketing.",
      });
    }

    if (hasPaymentClaim || hasPaymentSignal) {
      recommendedSafeActions.push({
        id: "sa_do_now_payment",
        title: "Do Not Transfer Money Yet",
        description: "Refrain from transferring money, paying deposit fees, or making UPI transfers to unverified advisory channels.",
        actionType: "REFRAIN_FROM_PAYMENT",
        priority: "DO_NOW",
      });

      recommendedSafeActions.push({
        id: "sa_paid_cybercrime",
        title: "Report Financial Fraud Promptly",
        description: "If money has already been transferred, immediately notify your bank to freeze transactions and report on the National Cybercrime Portal.",
        actionType: "REPORT_SUSPICIOUS_CONTENT",
        priority: "IF_ALREADY_PAID",
        externalLink: "https://cybercrime.gov.in/",
      });
    }

    if (hasOffPlatformClaim) {
      uncertaintyItems.push({
        id: "unc_identity",
        title: "Sender Identity Unresolved",
        explanation: "The message invites participation in private messaging groups (Telegram/WhatsApp), where account ownership and identity cannot be verified from text alone.",
        reason: "Private messaging platforms mask account ownership.",
      });
    }

    // Always add baseline evidence preservation & credential safety if any risk signal is detected
    if (riskSignals.length > 0) {
      recommendedSafeActions.push({
        id: "sa_do_now_credentials",
        title: "Do Not Share Credentials or PINs",
        description: "Never share banking passwords, OTPs, or UPI PINs with anyone claiming to provide stock tips or advisory services.",
        actionType: "DO_NOT_SHARE_CREDENTIALS",
        priority: "DO_NOW",
      });

      recommendedSafeActions.push({
        id: "sa_verify_evidence",
        title: "Preserve Message Evidence",
        description: "Keep original unedited screenshots showing group names and numbers in case formal reporting is required.",
        actionType: "PRESERVE_EVIDENCE",
        priority: "VERIFY_BEFORE_ACTING",
      });
    }

    return { evidenceItems, uncertaintyItems, recommendedSafeActions };
  }
}