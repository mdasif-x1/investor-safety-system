package com.sangyan.investorsafety.domain.model;

public record UncertaintyItem(
    String id,
    String title,
    String explanation,
    String reason,
    String relatedClaimId
) {}
