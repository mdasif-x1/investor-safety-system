package com.sangyan.investorsafety.domain.model;

public record Claim(
    String id,
    String statement,
    ClaimCategory category,
    String sourceSnippet,
    String explanation,
    EvidenceStatus evidenceStatus
) {}
