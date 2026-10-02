package com.sangyan.investorsafety.domain.port;

public interface EvidenceProvider {

    EvidenceResponse evaluateEvidenceAndUncertainty(EvidenceRequest request);

}
