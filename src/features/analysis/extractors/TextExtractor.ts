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
    // Simulated OCR extraction logic for prototype phase with realistic extracted claims
    let mockExtractedText = "SEBI Registered Expert. Guaranteed 25% monthly returns. Limited seats. Join our Telegram group and deposit ₹20,000 today.";
    
    // Customize mock text based on filename if provided for demo testing
    if (file.name.toLowerCase().includes("legit") || file.name.toLowerCase().includes("webinar")) {
      mockExtractedText = "SEBI investor education webinar explaining mutual fund risks and diversification.";
    } else if (file.name.toLowerCase().includes("edu") || file.name.toLowerCase().includes("disclaimer")) {
      mockExtractedText = "Educational purposes only. Guaranteed returns are not promised. Join our Telegram channel to learn about common investment scams.";
    }

    const normalizedText = this.normalize(mockExtractedText);
    return {
      rawText: mockExtractedText,
      normalizedText,
      extractedFrom: "IMAGE",
      metadata: {
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    };
  }

  private normalize(text: string): string {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();
  }
}
