package com.sangyan.investorsafety.domain.model;

public record SafeAction(
    String id,
    String title,
    String description,
    SafeActionType actionType,
    String priority,
    String externalLink
) {}
