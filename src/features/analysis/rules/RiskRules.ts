import { RiskSignal, Claim } from "@/types/analysis";

export interface AnalysisContext {
  rawText: string;
  normalizedText: string;
}

export interface IRiskRule {
  id: string;
  code: string;
  evaluate(context: AnalysisContext): RiskSignal | null;
}

// Helper for basic context negation check (e.g. "not guaranteed", "no guaranteed")
function isNegated(text: string, matchIndex: number): boolean {
  const windowStart = Math.max(0, matchIndex - 35);
  const precedingText = text.substring(windowStart, matchIndex).toLowerCase();
  const negationWords = ["not", "no ", "never", "without", "disclaimer", "education", "educational", "fake"];
  return negationWords.some((neg) => precedingText.includes(neg));
}

export class GuaranteedReturnRule implements IRiskRule {
  id = "R01";
  code = "GUARANTEED_RETURN";

  evaluate(context: AnalysisContext): RiskSignal | null {
    const text = context.normalizedText;
    const regex = /(guaranteed|assured|100%|fixed)\s+(returns?|profits?|income|monthly|daily)/i;
    const match = text.match(regex);

    if (match && match.index !== undefined) {
      if (isNegated(text, match.index)) {
        return null; // Context-aware negation avoidance
      }
      return {
        id: "sig_r01",
        code: this.code,
        title: "Guaranteed Return Language",
        description: "Promises of assured or fixed returns in equity/derivatives carry high risk. SEBI rules prohibit guaranteed return promises.",
        severity: "CRITICAL",
        matchedTextSnippet: match[0],
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
      if (isNegated(text, match.index)) return null;
      return {
        id: "sig_r02",
        code: this.code,
        title: "Artificial Urgency Pressure",
        description: "Pressure to act quickly limits your time to independently verify credentials before transferring funds.",
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
    const regex = /(deposit|pay|transfer|fee|upi|gpay|phonepe)\s*(?:₹|rs\.?|rupees)?\s*\d+/i;
    const match = text.match(regex);

    if (match && match.index !== undefined) {
      if (isNegated(text, match.index)) return null;
      return {
        id: "sig_r03",
        code: this.code,
        title: "Direct Upfront Payment Request",
        description: "Asks for upfront fees or deposits into personal accounts or unverified advisory channels.",
        severity: "CRITICAL",
        matchedTextSnippet: match[0],
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
      // If message is purely educational/disclaimer, avoid blind trigger
      if (text.toLowerCase().includes("educational purposes only") && isNegated(text, match.index)) {
        return null;
      }
      return {
        id: "sig_r04",
        code: this.code,
        title: "Unverified Regulatory Identity Claim",
        description: "The sender claims official SEBI registration or approval; this must be verified on official SEBI SCORES database.",
        severity: "HIGH",
        matchedTextSnippet: match[0],
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
      if (isNegated(text, match.index)) return null;
      return {
        id: "sig_r05",
        code: this.code,
        title: "Off-Platform Group Redirection",
        description: "Moves conversation to private messaging groups (Telegram/WhatsApp) where identity and oversight are difficult to verify.",
        severity: "MEDIUM",
        matchedTextSnippet: match[0],
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

  analyze(context: AnalysisContext): { riskSignals: RiskSignal[]; claims: Claim[] } {
    const riskSignals: RiskSignal[] = [];
    const claims: Claim[] = [];

    for (const rule of this.rules) {
      const signal = rule.evaluate(context);
      if (signal) {
        riskSignals.push(signal);
      }
    }

    // Extract basic explicit claims
    if (context.normalizedText.toLowerCase().includes("guaranteed") || context.normalizedText.toLowerCase().includes("assured")) {
      claims.push({
        id: "cl_1",
        statement: "Offers guaranteed high returns on investment",
        category: "GUARANTEED_RETURN",
        explanation: "Message promises fixed or risk-free financial returns.",
      });
    }

    if (context.normalizedText.toLowerCase().includes("sebi")) {
      claims.push({
        id: "cl_2",
        statement: "Claims SEBI registration or official affiliation",
        category: "UNREGISTERED_ADVISORY",
        explanation: "Message asserts regulatory approval or registration status.",
      });
    }

    return { riskSignals, claims };
  }
}
