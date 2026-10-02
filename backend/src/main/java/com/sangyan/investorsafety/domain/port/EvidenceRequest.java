package com.sangyan.investorsafety.domain.port;

import com.sangyan.investorsafety.domain.model.Claim;
import com.sangyan.investorsafety.domain.model.RiskSignal;
import java.util.List;

public record EvidenceRequest(
    List<Claim> claims,
    List<RiskSignal> riskSignals,
    String verificationIntentScope
) {
    public EvidenceRequest(List<Claim> claims, List<RiskSignal> riskSignals) {
        this(claims, riskSignals, "GENERAL_SAFETY_CHECK");
    }
}
