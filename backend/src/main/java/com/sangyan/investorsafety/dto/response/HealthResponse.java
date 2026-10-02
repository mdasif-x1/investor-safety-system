package com.sangyan.investorsafety.dto.response;

import java.time.Instant;

public record HealthResponse(
    String status,
    String service,
    String timestamp
) {
    public static HealthResponse ok() {
        return new HealthResponse("UP", "sangyan-investor-safety-backend", Instant.now().toString());
    }
}
