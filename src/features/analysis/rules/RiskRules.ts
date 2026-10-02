import { RiskSignal } from "@/types/analysis";

export interface AnalysisContext {
  rawText: string;
  normalizedText: string;
}

export interface IRiskRule {
  id: string;
  code: string;
  evaluate(context: AnalysisContext): RiskSignal | null;
}

function isNegatedOrEducational(text: string, matchIndex: number): boolean {
  const windowStart = Math.max(0, matchIndex - 40);
  const windowEnd = Math.min(text.length, matchIndex + 50);
  const snippet = text.substring(windowStart, windowEnd).toLowerCase();

  const negationPhrases = [
    "not promised",
    "are not promised",
    "never promised",
    "no guaranteed",
    "not guaranteed",
    "never share your",
    "dont share",
    "educational purposes only",
    "learn about common investment scams",
    "how fake investment",
    "explain mutual fund risks"
  ];

  return negationPhrases.some((phrase) => snippet.includes(phrase));
}

export class GuaranteedReturnRule implements IRiskRule {
  id = "R01";
  code = "GUARANTEED_RETURN";

  evaluate(context: AnalysisContext): RiskSignal | null {
    const text = context.normalizedText;
    const regex = /(guaranteed|assured|100%|fixed)\s+(returns?|profits?|income|monthly|daily)/i;
    const match = text.match(regex);

    if (match && match.index !== undefined) {
      if (isNegatedOrEducational(text, match.index)) {
        return null;
      }
      return {
        id: "sig_r01",
        code: this.code,
        title: "Guaranteed Return Pattern",
        description: "Promises of guaranteed or fixed returns carry high risk. SEBI regulations explicitly prohibit guaranteed return promises on equity investments.",
        severity: "HIGH",
        matchedTextSnippet: match[0],
        relatedClaimId: "cl_return_1",
      };
    }
    return null;
  }
}

export class UrgencyPressureRule implements IRiskRule {
  id = "R02";
  code = "URGENCY_PRESSURE";

  evaluate(context: AnalysisContext): RiskSignal | null {
    const text = context.normalizedText;
    const regex = /(limited\s+seats|act\s+fast|today\s+only|hurry|last\s+chance|immediate\s+join)/i;
    const match = text.match(regex);

    if (match && match.index !== undefined) {
      if (isNegatedOrEducational(text, match.index)) return null;
      return {
        id: "sig_r02",
        code: this.code,
        title: "Artificial Urgency Pressure Pattern",
        description: "Creating artificial deadline pressure reduces your time to independently verify credentials before transferring funds.",
        severity: "HIGH",
        matchedTextSnippet: match[0],
      };
    }
    return null;
  }
}

export class DirectPaymentRequestRule implements IRiskRule {
  id = "R03";
  code = "DIRECT_PAYMENT_REQUEST";

  evaluate(context: AnalysisContext): RiskSignal | null {
    const text = context.normalizedText;
    const regex = /(deposit|pay|transfer|fee|upi|gpay|phonepe)\s+(?:rupees|rs|inr|₹)?\s*\d+/i;
    const match = text.match(regex);

    if (match && match.index !== undefined) {
      if (isNegatedOrEducational(text, match.index)) return null;
      return {
        id: "sig_r03",
        code: this.code,
        title: "Direct Upfront Payment Request Pattern",
        description: "Asks for monetary transfer into unverified advisory channels or personal bank/UPI destinations.",
        severity: "HIGH",
        matchedTextSnippet: match[0],
        relatedClaimId: "cl_payment_1",
      };
    }
    return null;
  }
}

export class RegulatoryIdentityClaimRule implements IRiskRule {
  id = "R04";
  code = "REGULATORY_IDENTITY_CLAIM";

  evaluate(context: AnalysisContext): RiskSignal | null {
    const text = context.normalizedText;
    const regex = /(sebi\s+registered|sebi\s+approved|govt\s+approved|sebi\s+expert|registered\s+analyst)/i;
    const match = text.match(regex);

    if (match && match.index !== undefined) {
      if (isNegatedOrEducational(text, match.index)) return null;
      return {
        id: "sig_r04",
        code: this.code,
        title: "Unverified Regulatory Identity Claim Pattern",
        description: "The sender claims official SEBI registration or approval; this must be independently verified on official public registers.",
        severity: "MEDIUM",
        matchedTextSnippet: match[0],
        relatedClaimId: "cl_sebi_1",
      };
    }
    return null;
  }
}

export class OffPlatformRedirectionRule implements IRiskRule {
  id = "R05";
  code = "OFF_PLATFORM_REDIRECTION";

  evaluate(context: AnalysisContext): RiskSignal | null {
    const text = context.normalizedText;
    const regex = /(join\s+telegram|vip\s+group|whatsapp\s+group|t\.me\/|chat\.whatsapp\.com)/i;
    const match = text.match(regex);

    if (match && match.index !== undefined) {
      if (isNegatedOrEducational(text, match.index)) return null;
      return {
        id: "sig_r05",
        code: this.code,
        title: "Off-Platform Group Redirection Pattern",
        description: "Moves conversation to private messaging channels (Telegram/WhatsApp) where identity verification is difficult.",
        severity: "MEDIUM",
        matchedTextSnippet: match[0],
        relatedClaimId: "cl_group_1",
      };
    }
    return null;
  }
}

export class RiskEngine {
  private rules: IRiskRule[] = [
    new GuaranteedReturnRule(),
    new UrgencyPressureRule(),
    new DirectPaymentRequestRule(),
    new RegulatoryIdentityClaimRule(),
    new OffPlatformRedirectionRule(),
  ];

  analyze(context: AnalysisContext): RiskSignal[] {
    const riskSignals: RiskSignal[] = [];

    for (const rule of this.rules) {
      const signal = rule.evaluate(context);
      if (signal) {
        riskSignals.push(signal);
      }
    }

    return riskSignals;
  }
}