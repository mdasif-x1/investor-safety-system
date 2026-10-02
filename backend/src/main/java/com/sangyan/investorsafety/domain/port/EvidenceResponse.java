package com.sangyan.investorsafety.domain.port;

import com.sangyan.investorsafety.domain.model.EvidenceItem;
import com.sangyan.investorsafety.domain.model.ProviderStatus;
import com.sangyan.investorsafety.domain.model.SafeAction;
import com.sangyan.investorsafety.domain.model.UncertaintyItem;
import java.util.List;

public record EvidenceResponse(
    List<EvidenceItem> evidenceItems,
    List<UncertaintyItem> uncertaintyItems,
    List<SafeAction> recommendedSafeActions,
    ProviderStatus providerStatus
) {}
