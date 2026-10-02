package com.sangyan.investorsafety.dto.response;

import com.sangyan.investorsafety.domain.model.Claim;
import com.sangyan.investorsafety.domain.model.EvidenceItem;
import com.sangyan.investorsafety.domain.model.RiskSignal;
import com.sangyan.investorsafety.domain.model.SafeAction;
import com.sangyan.investorsafety.domain.model.SafetyAnalysisResult;
import com.sangyan.investorsafety.domain.model.UncertaintyItem;
import java.util.List;

public record AnalysisResponse(
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
) {
    public static AnalysisResponse fromDomain(SafetyAnalysisResult result) {
        return new AnalysisResponse(
            result.id(),
            result.timestamp(),
            result.status(),
            result.rawText(),
            result.normalizedText(),
            result.claims(),
            result.riskSignals(),
            result.evidence(),
            result.uncertaintyItems(),
            result.uncertaintyExplanation(),
            result.recommendedSafeActions()
        );
    }
}
