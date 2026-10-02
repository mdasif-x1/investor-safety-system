import { SafetyAnalysisResult } from "@/types/analysis";
import { TextExtractor, ExtractionResult } from "../extractors/TextExtractor";
import { RuleBasedClaimExtractor } from "../extractors/ClaimExtractor";
import { RiskEngine } from "../rules/RiskRules";
import { MockEvidenceProvider } from "./EvidenceProvider";

export interface IAnalysisService {
  analyzeText(text: string): Promise<SafetyAnalysisResult>;
  analyzeImage(file: File): Promise<SafetyAnalysisResult>;
  getAnalysisById(id: string): SafetyAnalysisResult | null;
}

const sessionAnalysisStore: Map<string, SafetyAnalysisResult> = new Map();

export class MockAnalysisService implements IAnalysisService {
  private textExtractor = new TextExtractor();
  private claimExtractor = new RuleBasedClaimExtractor();
  private riskEngine = new RiskEngine();
  private evidenceProvider = new MockEvidenceProvider();

  async analyzeText(text: string): Promise<SafetyAnalysisResult> {
    const extraction = await this.textExtractor.extractFromText(text);
    return this.processExtraction(extraction);
  }

  async analyzeImage(file: File): Promise<SafetyAnalysisResult> {
    const extraction = await this.textExtractor.extractFromImage(file);
    return this.processExtraction(extraction);
  }

  getAnalysisById(id: string): SafetyAnalysisResult | null {
    return sessionAnalysisStore.get(id) || null;
  }

  private processExtraction(extraction: ExtractionResult): SafetyAnalysisResult {
    const analysisId = `ANL-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // 1. Extract explicit claims
    const claims = this.claimExtractor.extractClaims(extraction.normalizedText);

    // 2. Evaluate risk signals
    const riskSignals = this.riskEngine.analyze({
      rawText: extraction.rawText,
      normalizedText: extraction.normalizedText,
    });

    // 3. Evaluate condition-dependent evidence & uncertainty layer
    const { evidenceItems, uncertaintyItems, recommendedSafeActions } = 
      this.evidenceProvider.evaluateEvidenceAndUncertainty(claims, riskSignals);

    const uncertaintyExplanation = riskSignals.length > 0
      ? "This message contains characteristics that deserve caution. The system has not established that the sender is fraudulent, but identity and credentials remain unverified."
      : "No major warning patterns were detected in the submitted text. Absence of detected warning patterns does not independently prove that the offer or sender is legitimate.";

    const result: SafetyAnalysisResult = {
      id: analysisId,
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      rawInput: {
        text: extraction.extractedFrom === "TEXT" ? extraction.rawText : undefined,
        imageUrl: extraction.extractedFrom === "IMAGE" ? extraction.metadata?.filename : undefined,
      },
      normalizedText: extraction.normalizedText,
      claims,
      riskSignals,
      evidence: evidenceItems,
      uncertaintyItems,
      uncertaintyExplanation,
      recommendedSafeActions,
    };

    sessionAnalysisStore.set(analysisId, result);
    return result;
  }
}

export const analysisService = new MockAnalysisService();