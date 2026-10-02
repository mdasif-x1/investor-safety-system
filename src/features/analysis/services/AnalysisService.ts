import { SafetyAnalysisResult } from "@/types/analysis";
import { TextExtractor } from "../extractors/TextExtractor";
import { analysisApiClient } from "./analysisApi";

export interface IAnalysisService {
  analyzeText(text: string): Promise<SafetyAnalysisResult>;
  analyzeImage(file: File): Promise<SafetyAnalysisResult>;
  getAnalysisById(id: string): SafetyAnalysisResult | null;
}

const sessionAnalysisStore: Map<string, SafetyAnalysisResult> = new Map();

export class BackendAnalysisService implements IAnalysisService {
  private textExtractor = new TextExtractor();

  async analyzeText(text: string): Promise<SafetyAnalysisResult> {
    const result = await analysisApiClient.analyzeText(text);
    sessionAnalysisStore.set(result.id, result);
    return result;
  }

  async analyzeImage(file: File): Promise<SafetyAnalysisResult> {
    const extraction = await this.textExtractor.extractFromImage(file);
    const result = await analysisApiClient.analyzeText(extraction.normalizedText);
    const updatedResult: SafetyAnalysisResult = {
      ...result,
      rawInput: {
        imageUrl: file.name,
        text: extraction.normalizedText,
      },
    };
    sessionAnalysisStore.set(updatedResult.id, updatedResult);
    return updatedResult;
  }

  getAnalysisById(id: string): SafetyAnalysisResult | null {
    return sessionAnalysisStore.get(id) || null;
  }
}

export const analysisService = new BackendAnalysisService();