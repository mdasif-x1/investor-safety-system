import { Claim, EvidenceStatus } from "@/types/analysis";

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
        statement: "Claims SEBI registration or regulatory approval status",
        category: "REGULATORY_IDENTITY",
        sourceSnippet: sebiMatch[0],
        explanation: "Message explicitly asserts that the sender or organization holds official SEBI registration.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    // 2. Guaranteed Return Claim
    const returnRegex = /(guaranteed|assured|100%|fixed)\s+(returns?|profits?|income|monthly|daily)/i;
    const returnMatch = normalized.match(returnRegex);
    if (returnMatch) {
      claims.push({
        id: "cl_return_1",
        statement: "Promises guaranteed or risk-free financial returns",
        category: "GUARANTEED_RETURN",
        sourceSnippet: returnMatch[0],
        explanation: "Message promises fixed or assured profit margins on equity/derivatives investment.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    // 3. Payment Request Claim
    const paymentRegex = /(deposit|pay|transfer|fee|upi|gpay|phonepe)\s*(?:₹|rs\.?|rupees)?\s*\d+/i;
    const paymentMatch = normalized.match(paymentRegex);
    if (paymentMatch) {
      claims.push({
        id: "cl_payment_1",
        statement: "Requests upfront payment or deposit to personal accounts",
        category: "PAYMENT_REQUEST",
        sourceSnippet: paymentMatch[0],
        explanation: "Message requires monetary transfer before granting access to advisory or stock tips.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    // 4. Off-Platform Group Invitation Claim
    const groupRegex = /(join\s+telegram|vip\s+group|whatsapp\s+group|t\.me\/|chat\.whatsapp\.com)/i;
    const groupMatch = normalized.match(groupRegex);
    if (groupMatch) {
      claims.push({
        id: "cl_group_1",
        statement: "Invites recipient to private messaging group (Telegram / WhatsApp)",
        category: "OFF_PLATFORM_INVITATION",
        sourceSnippet: groupMatch[0],
        explanation: "Message invites participation in external private communication channels.",
        evidenceStatus: "UNVERIFIED",
      });
    }

    return claims;
  }
}