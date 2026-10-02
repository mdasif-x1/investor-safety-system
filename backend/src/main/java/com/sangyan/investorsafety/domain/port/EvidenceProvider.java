package com.sangyan.investorsafety.domain.port;

import com.sangyan.investorsafety.domain.model.Claim;
import com.sangyan.investorsafety.domain.model.EvidenceItem;
import com.sangyan.investorsafety.domain.model.RiskSignal;
import com.sangyan.investorsafety.domain.model.SafeAction;
import com.sangyan.investorsafety.domain.model.UncertaintyItem;
import java.util.List;

public interface EvidenceProvider {

    EvidenceEvaluationResult evaluateEvidenceAndUncertainty(
        List<Claim> claims,
        List<RiskSignal> riskSignals
    );

    record EvidenceEvaluationResult(
        List<EvidenceItem> evidenceItems,
        List<UncertaintyItem> uncertaintyItems,
        List<SafeAction> recommendedSafeActions
    ) {}
}
