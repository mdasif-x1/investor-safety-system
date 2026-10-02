import { Claim } from "@/types/analysis";

export interface IClaimExtractor {
  extractClaims(text: string): Claim[];
}

export class RuleBasedClaimExtractor implements IClaimExtractor {
  extractClaims(text: string): Claim[] {
    const claims: Claim[] = [];
    const normalized = text.trim();

    // 1. Regulatory Identity Claim
    const sebiRegex = /(sebi\s+registered\s+[a-z]+|sebi\s+expert|sebi\s+approved|registered\s+analyst)/i;
    const sebiMatch = normalized.match(sebiRegex);
    if (sebiMatch) {
      claims.push({
        id: "cl_sebi_1",
        statement: "The message claims SEBI registration or regulatory approval status.",
        category: "REGULATORY_IDENTITY",
        sourceSnippet: sebiMatch[0],
        explanation: "Sender explicitly asserts that they hold official SEBI registration or approval.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    // 2. Guaranteed Return Claim
    const returnRegex = /(guaranteed|assured|100%|fixed)\s+(returns?|profits?|income|monthly|daily)/i;
    const returnMatch = normalized.match(returnRegex);
    if (returnMatch) {
      claims.push({
        id: "cl_return_1",
        statement: "The message promises guaranteed or fixed financial returns.",
        category: "GUARANTEED_RETURN",
        sourceSnippet: returnMatch[0],
        explanation: "Sender asserts specific fixed profit margins on stock investments.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    // 3. Payment Request Claim
    const paymentRegex = /(?:deposit|pay|transfer|send)\s+(?:the\s+)?(?:registration\s+|joining\s+|advisory\s+)?(?:fee|amount|deposit|money)?\s*(?:of\s+)?(?:rupees|rs\.?|inr|₹)?\s*\d+/i;
    const paymentMatch = normalized.match(paymentRegex);
    if (paymentMatch) {
      claims.push({
        id: "cl_payment_1",
        statement: "The message contains a request for an upfront payment or deposit.",
        category: "PAYMENT_REQUEST",
        sourceSnippet: paymentMatch[0],
        explanation: "Sender requires a money transfer before unlocking stock tips or group access.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    // 4. Off-Platform Group Invitation Claim
    const groupRegex = /(join\s+telegram|vip\s+group|whatsapp\s+group|t\.me\/|chat\.whatsapp\.com)/i;
    const groupMatch = normalized.match(groupRegex);
    if (groupMatch) {
      claims.push({
        id: "cl_group_1",
        statement: "The message invites participation in a private messaging group (Telegram / WhatsApp).",
        category: "OFF_PLATFORM_INVITATION",
        sourceSnippet: groupMatch[0],
        explanation: "Sender redirects conversation into private channels where identity oversight is limited.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    return claims;
  }
}