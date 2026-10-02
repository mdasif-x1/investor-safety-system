export type SignalSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";

export type ClaimCategory = 
  | "REGULATORY_IDENTITY"
  | "GUARANTEED_RETURN" 
  | "PERFORMANCE_CLAIM" 
  | "PAYMENT_REQUEST" 
  | "PROMOTIONAL_OFFER" 
  | "OFF_PLATFORM_INVITATION" 
  | "EDUCATIONAL_STATEMENT"
  | "OTHER";

export type EvidenceStatus = 
  | "SUPPORTED" 
  | "UNVERIFIED" 
  | "CONTRADICTED" 
  | "INSUFFICIENT_INFORMATION" 
  | "SOURCE_UNAVAILABLE";

export type EvidenceSourceType =
  | "OFFICIAL_REGISTRY"
  | "OFFICIAL_GUIDANCE"
  | "USER_PROVIDED_CONTENT"
  | "PUBLIC_SOURCE"
  | "INTERNAL_RULE"
  | "NONE";

export type SafeActionType = 
  | "REFRAIN_FROM_PAYMENT"
  | "SEBI_LOOKUP" 
  | "PRESERVE_EVIDENCE"
  | "REPORT_SUSPICIOUS_CONTENT"
  | "VERIFY_PAN_REGISTRATION";

export type AnalysisStage = 
  | "MESSAGE_RECEIVED"
  | "TEXT_EXTRACTED"
  | "CLAIMS_EXTRACTED"
  | "SIGNALS_IDENTIFIED"
  | "EVIDENCE_CHECKING"
  | "COMPLETED";

export interface Claim {
  id: string;
  statement: string;
  category: ClaimCategory;
  sourceSnippet?: string;
  explanation: string;
  evidenceStatus: EvidenceStatus;
}

export interface RiskSignal {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: SignalSeverity;
  matchedTextSnippet?: string;
  relatedClaimId?: string;
}

export interface EvidenceItem {
  id: string;
  claimId?: string;
  sourceName: string;
  sourceType: EvidenceSourceType;
  status: EvidenceStatus;
  explanation: string;
  sourceUrl?: string;
  checkedAt?: string;
}

export interface UncertaintyItem {
  id: string;
  title: string;
  explanation: string;
  reason: string;
  relatedClaimId?: string;
}

export interface SafeAction {
  id: string;
  title: string;
  description: string;
  actionType: SafeActionType;
  priority: "DO_NOW" | "VERIFY_BEFORE_ACTING" | "IF_ALREADY_PAID";
  externalLink?: string;
}

export interface SafetyAnalysisResult {
  id: string;
  timestamp: string;
  status: "PROCESSING" | "PARTIAL" | "COMPLETED" | "DEGRADED" | "FAILED";
  rawInput: {
    text?: string;
    imageUrl?: string;
  };
  normalizedText: string;
  claims: Claim[];
  riskSignals: RiskSignal[];
  verifiedEvidence: EvidenceItem[];
  uncertaintyItems: UncertaintyItem[];
  uncertaintyExplanation: string;
  recommendedSafeActions: SafeAction[];
}