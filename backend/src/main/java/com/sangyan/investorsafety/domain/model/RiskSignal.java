package com.sangyan.investorsafety.domain.model;

public record RiskSignal(
    String id,
    String code,
    String title,
    String description,
    SignalSeverity severity,
    String matchedTextSnippet,
    String relatedClaimId
) {}
