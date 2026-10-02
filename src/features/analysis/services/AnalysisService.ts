import { SafetyAnalysisResult, SafeAction } from "@/types/analysis";
import { TextExtractor, ExtractionResult } from "../extractors/TextExtractor";
import { RiskEngine } from "../rules/RiskRules";

export interface IAnalysisService {
  analyzeText(text: string): Promise<SafetyAnalysisResult>;
  analyzeImage(file: File): Promise<SafetyAnalysisResult>;
  getAnalysisById(id: string): SafetyAnalysisResult | null;
}

// Global in-memory storage for prototype session
const sessionAnalysisStore: Map<string, SafetyAnalysisResult> = new Map();

export class MockAnalysisService implements IAnalysisService {
  private extractor = new TextExtractor();
  private riskEngine = new RiskEngine();

  async analyzeText(text: string): Promise<SafetyAnalysisResult> {
    const extraction = await this.extractor.extractFromText(text);
    return this.processExtraction(extraction);
  }

  async analyzeImage(file: File): Promise<SafetyAnalysisResult> {
    const extraction = await this.extractor.extractFromImage(file);
    return this.processExtraction(extraction);
  }

  getAnalysisById(id: string): SafetyAnalysisResult | null {
    return sessionAnalysisStore.get(id) || null;
  }

  private processExtraction(extraction: ExtractionResult): SafetyAnalysisResult {
    const analysisId = `ANL-${Math.floor(100000 + Math.random() * 900000)}`;
    const { riskSignals, claims } = this.riskEngine.analyze({
      rawText: extraction.rawText,
      normalizedText: extraction.normalizedText,
    });

    // Default safe actions preview
    const recommendedSafeActions: SafeAction[] = [
      {
        id: "sa_1",
        title: "Do Not Transfer Money",
        description: "Refrain from making payments to personal UPI IDs or unverified advisory channels.",
        actionType: "REFRAIN_FROM_PAYMENT",
      },
      {
        id: "sa_2",
        title: "Verify SEBI Registration",
        description: "Search official SEBI SCORES database to check if the advisor is genuinely registered.",
        actionType: "SEBI_LOOKUP",
        externalLink: "https://scores.sebi.gov.in/",
      },
    ];

    const result: SafetyAnalysisResult = {
      id: analysisId,
      timestamp: new Date().toISOString(),
      rawInput: {
        text: extraction.extractedFrom === "TEXT" ? extraction.rawText : undefined,
        imageUrl: extraction.extractedFrom === "IMAGE" ? extraction.metadata?.filename : undefined,
      },
      normalizedText: extraction.normalizedText,
      claims,
      riskSignals,
      verifiedEvidence: [
        {
          id: "ev_1",
          sourceName: "SEBI Research Analyst Registry",
          status: riskSignals.length > 0 ? "UNABLE_TO_VERIFY" : "INSUFFICIENT_INFORMATION",
          details: riskSignals.length > 0 
            ? "Unverified entity name provided in advisory message." 
            : "No suspicious entity claims detected in submission.",
        }
      ],
      unverifiedAspects: [
        "Identity of group administrator in private messaging channels",
        "Historical track record of claimed investment performance",
      ],
      uncertaintyExplanation: "Private messaging groups (WhatsApp/Telegram) mask real identities. Unregistered entities can spoof registration claims.",
      recommendedSafeActions,
    };

    sessionAnalysisStore.set(analysisId, result);
    return result;
  }
}

export const analysisService = new MockAnalysisService();
