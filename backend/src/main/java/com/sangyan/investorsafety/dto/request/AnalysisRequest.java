package com.sangyan.investorsafety.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AnalysisRequest(
    @NotBlank(message = "Text input cannot be blank")
    @Size(max = 10000, message = "Text input exceeds maximum length")
    String text
) {}
