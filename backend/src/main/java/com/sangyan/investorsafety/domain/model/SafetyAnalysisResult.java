package com.sangyan.investorsafety.domain.model;

import java.util.List;

public record SafetyAnalysisResult(
    String id,
    String timestamp,
    String status,
    String rawText,
    String normalizedText,
    List<Claim> claims,
    List<RiskSignal> riskSignals,
    List<EvidenceItem> evidence,
    List<UncertaintyItem> uncertaintyItems,
    String uncertaintyExplanation,
    List<SafeAction> recommendedSafeActions
) {}
