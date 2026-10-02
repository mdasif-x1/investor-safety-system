import { recognize } from "tesseract.js";

export interface ExtractionResult {
  rawText: string;
  normalizedText: string;
  extractedFrom: "TEXT" | "IMAGE";
  metadata?: {
    filename?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

export interface ITextExtractor {
  extractFromText(input: string): Promise<ExtractionResult>;
  extractFromImage(file: File): Promise<ExtractionResult>;
}

export class TextExtractor implements ITextExtractor {
  async extractFromText(input: string): Promise<ExtractionResult> {
    const rawText = input.trim();
    const normalizedText = this.normalize(rawText);
    return {
      rawText,
      normalizedText,
      extractedFrom: "TEXT",
    };
  }

  async extractFromImage(file: File): Promise<ExtractionResult> {
    try {
      // Local client-side browser OCR processing
      const { data } = await recognize(file, "eng");
      const extractedText = data.text ? data.text.trim() : "";

      if (!extractedText || extractedText.length === 0) {
        throw new Error("No readable text was extracted from this image. Please upload a clearer screenshot or paste the message text manually.");
      }

      if (extractedText.length > 10000) {
        throw new Error("Extracted screenshot text exceeds maximum allowed length (10,000 characters). Please crop the screenshot to the relevant message.");
      }

      const normalizedText = this.normalize(extractedText);
      return {
        rawText: extractedText,
        normalizedText,
        extractedFrom: "IMAGE",
        metadata: {
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
        },
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("No readable text")) {
        throw err;
      }
      if (err instanceof Error && err.message.includes("exceeds maximum allowed length")) {
        throw err;
      }
      throw new Error("Failed to read text from screenshot. Please try a clearer screenshot or paste the message manually.");
    }
  }

  private normalize(text: string): string {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();
  }
}
