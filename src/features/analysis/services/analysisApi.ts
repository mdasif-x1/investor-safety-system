import { SafetyAnalysisResult } from "@/types/analysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface AnalysisApiRequest {
  text: string;
}

export class AnalysisApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async analyzeText(text: string): Promise<SafetyAnalysisResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/api/v1/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Analysis request timed out. Please check backend availability and try again.");
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Invalid message request. Please provide valid message text.");
      }
      throw new Error(`Server returned status ${response.status}. Could not complete analysis.`);
    }

    const data = await response.json();
    
    // Map backend AnalysisResponse to frontend SafetyAnalysisResult model
    return {
      id: data.id,
      timestamp: data.timestamp,
      status: (data.status as SafetyAnalysisResult["status"]) || "COMPLETED",
      rawInput: {
        text: data.rawText || text,
      },
      normalizedText: data.normalizedText || text,
      claims: data.claims || [],
      riskSignals: data.riskSignals || [],
      evidence: data.evidence || [],
      uncertaintyItems: data.uncertaintyItems || [],
      uncertaintyExplanation: data.uncertaintyExplanation || "",
      recommendedSafeActions: data.recommendedSafeActions || [],
    };
  }
}

export const analysisApiClient = new AnalysisApiClient();
