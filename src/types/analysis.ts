export type SignalSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";

export type ClaimCategory = 
  | "GUARANTEED_RETURN" 
  | "UNREGISTERED_ADVISORY" 
  | "ARTIFICIAL_URGENCY" 
  | "UNVERIFIED_VIP_GROUP" 
  | "CRYPTO_FOREX_SCHEME"
  | "OTHER";

export type EvidenceStatus = 
  | "VERIFIED_LEGIT" 
  | "FLAGGED_UNREGISTERED" 
  | "UNABLE_TO_VERIFY" 
  | "INSUFFICIENT_INFORMATION";

export type SafeActionType = 
  | "SEBI_LOOKUP" 
  | "REPORT_SCORES" 
  | "CEASE_COMMUNICATION" 
  | "VERIFY_PAN_REGISTRATION"
  | "REFRAIN_FROM_PAYMENT";

export type AnalysisStage = 
  | "MESSAGE_RECEIVED"
  | "TEXT_EXTRACTED"
  | "SIGNALS_IDENTIFIED"
  | "EVIDENCE_CHECKING"
  | "COMPLETED";

export interface Claim {
  id: string;
  statement: string;
  category: ClaimCategory;
  explanation: string;
}

export interface RiskSignal {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: SignalSeverity;
  matchedTextSnippet?: string;
}

export interface EvidenceItem {
  id: string;
  sourceName: string;
  status: EvidenceStatus;
  details: string;
  referenceUrl?: string;
}

export interface SafeAction {
  id: string;
  title: string;
  description: string;
  actionType: SafeActionType;
  externalLink?: string;
}

export interface SafetyAnalysisResult {
  id: string;
  timestamp: string;
  rawInput: {
    text?: string;
    imageUrl?: string;
  };
  normalizedText: string;
  claims: Claim[];
  riskSignals: RiskSignal[];
  verifiedEvidence: EvidenceItem[];
  unverifiedAspects: string[];
  uncertaintyExplanation: string;
  recommendedSafeActions: SafeAction[];
}
