package com.sangyan.investorsafety.domain.model;

public record EvidenceItem(
    String id,
    String claimId,
    String sourceName,
    EvidenceSourceType sourceType,
    EvidenceStatus status,
    String explanation,
    String sourceUrl,
    String checkedAt,
    String scope
) {}
