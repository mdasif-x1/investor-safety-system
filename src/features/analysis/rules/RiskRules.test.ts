import { RiskEngine } from "./RiskRules";

describe("RiskEngine Context-Aware Rules", () => {
  const engine = new RiskEngine();

  test("Golden Suspicious Message triggers multiple critical risk signals", () => {
    const text = "SEBI Registered Expert. Guaranteed 25% monthly returns. Limited seats. Join our Telegram group and deposit ₹20,000 today.";
    const result = engine.analyze({ rawText: text, normalizedText: text });

    expect(result.riskSignals.some((s) => s.code === "GUARANTEED_RETURN")).toBe(true);
    expect(result.riskSignals.some((s) => s.code === "URGENCY_PRESSURE")).toBe(true);
    expect(result.riskSignals.some((s) => s.code === "DIRECT_PAYMENT_REQUEST")).toBe(true);
    expect(result.riskSignals.some((s) => s.code === "REGULATORY_IDENTITY_CLAIM")).toBe(true);
    expect(result.riskSignals.some((s) => s.code === "OFF_PLATFORM_REDIRECTION")).toBe(true);
  });

  test("Legitimate Webinar Message does not trigger risk signals", () => {
    const text = "SEBI investor education webinar explaining mutual fund risks and diversification.";
    const result = engine.analyze({ rawText: text, normalizedText: text });

    expect(result.riskSignals.length).toBe(0);
  });

  test("Adversarial Disclaimer Message avoids false positives", () => {
    const text = "Educational purposes only. Guaranteed returns are not promised. Join our Telegram channel to learn about common investment scams.";
    const result = engine.analyze({ rawText: text, normalizedText: text });

    // Negation handling prevents guaranteed return trigger
    expect(result.riskSignals.some((s) => s.code === "GUARANTEED_RETURN")).toBe(false);
  });
});