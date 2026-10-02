package com.sangyan.investorsafety.infrastructure.evidence;

import com.sangyan.investorsafety.domain.model.Claim;
import com.sangyan.investorsafety.domain.model.ClaimCategory;
import com.sangyan.investorsafety.domain.model.EvidenceItem;
import com.sangyan.investorsafety.domain.model.EvidenceSourceType;
import com.sangyan.investorsafety.domain.model.EvidenceStatus;
import com.sangyan.investorsafety.domain.model.RiskSignal;
import com.sangyan.investorsafety.domain.model.SafeAction;
import com.sangyan.investorsafety.domain.model.SafeActionType;
import com.sangyan.investorsafety.domain.model.UncertaintyItem;
import com.sangyan.investorsafety.domain.port.EvidenceProvider;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MockEvidenceProvider implements EvidenceProvider {

    @Override
    public EvidenceEvaluationResult evaluateEvidenceAndUncertainty(
        List<Claim> claims,
        List<RiskSignal> riskSignals
    ) {
        List<EvidenceItem> evidenceItems = new ArrayList<>();
        List<UncertaintyItem> uncertaintyItems = new ArrayList<>();
        List<SafeAction> recommendedSafeActions = new ArrayList<>();

        boolean hasRegulatoryClaim = claims.stream().anyMatch(c -> c.category() == ClaimCategory.REGULATORY_IDENTITY);
        boolean hasGuaranteedReturnClaim = claims.stream().anyMatch(c -> c.category() == ClaimCategory.GUARANTEED_RETURN);
        boolean hasPaymentClaim = claims.stream().anyMatch(c -> c.category() == ClaimCategory.PAYMENT_REQUEST);
        boolean hasOffPlatformClaim = claims.stream().anyMatch(c -> c.category() == ClaimCategory.OFF_PLATFORM_INVITATION);

        boolean hasPaymentSignal = riskSignals.stream().anyMatch(s -> "DIRECT_PAYMENT_REQUEST".equalsIgnoreCase(s.code()));

        if (hasRegulatoryClaim) {
            evidenceItems.add(new EvidenceItem(
                "ev_sebi_registry",
                null,
                "Official SEBI Public Guidance",
                EvidenceSourceType.OFFICIAL_GUIDANCE,
                EvidenceStatus.UNVERIFIED,
                "The message claims SEBI registration or regulatory approval status. Independent verification through official SEBI public sources is required before acting.",
                "https://scores.sebi.gov.in/",
                null,
                "Independent public lookup required; prototype did not query live registry endpoints."
            ));

            uncertaintyItems.add(new UncertaintyItem(
                "unc_registration",
                "Registration Status Unverified",
                "The message claims regulatory approval, but no live database lookup was performed in this prototype check.",
                "Official registry validation requires live query against authoritative SEBI registers.",
                null
            ));

            recommendedSafeActions.add(new SafeAction(
                "sa_verify_reg",
                "Verify Registration Independently",
                "Open official SEBI public registers directly to confirm if the entity or advisor is genuinely registered.",
                SafeActionType.SEBI_LOOKUP,
                "VERIFY_BEFORE_ACTING",
                "https://scores.sebi.gov.in/"
            ));
        }

        if (hasGuaranteedReturnClaim) {
            evidenceItems.add(new EvidenceItem(
                "ev_guaranteed_rule",
                null,
                "Official SEBI Public Guidance",
                EvidenceSourceType.OFFICIAL_GUIDANCE,
                EvidenceStatus.UNVERIFIED,
                "Official SEBI public guidance warns that promises of guaranteed or fixed returns on stock investments carry high risk.",
                "https://investor.sebi.gov.in/",
                null,
                "Public investor awareness guidance."
            ));

            uncertaintyItems.add(new UncertaintyItem(
                "unc_performance",
                "Historical Return Claims Unsupported",
                "The message promises high percentage returns, but no independent trade performance logs or verified audits were provided.",
                "Unverified return promises are common in advisory marketing.",
                null
            ));
        }

        if (hasPaymentClaim || hasPaymentSignal) {
            recommendedSafeActions.add(new SafeAction(
                "sa_do_now_payment",
                "Do Not Transfer Money Yet",
                "Refrain from transferring money, paying deposit fees, or making UPI transfers to unverified advisory channels.",
                SafeActionType.REFRAIN_FROM_PAYMENT,
                "DO_NOW",
                null
            ));

            recommendedSafeActions.add(new SafeAction(
                "sa_paid_cybercrime",
                "Report Financial Fraud Promptly",
                "If money has already been transferred, immediately notify your bank to freeze transactions and report on the National Cybercrime Portal.",
                SafeActionType.REPORT_SUSPICIOUS_CONTENT,
                "IF_ALREADY_PAID",
                "https://cybercrime.gov.in/"
            ));
        }

        if (hasOffPlatformClaim) {
            uncertaintyItems.add(new UncertaintyItem(
                "unc_identity",
                "Sender Identity Unresolved",
                "The message invites participation in private messaging groups (Telegram/WhatsApp), where account ownership and identity cannot be verified from text alone.",
                "Private messaging platforms mask account ownership.",
                null
            ));
        }

        if (!riskSignals.isEmpty()) {
            recommendedSafeActions.add(new SafeAction(
                "sa_do_now_credentials",
                "Do Not Share Credentials or PINs",
                "Never share banking passwords, OTPs, or UPI PINs with anyone claiming to provide stock tips or advisory services.",
                SafeActionType.DO_NOT_SHARE_CREDENTIALS,
                "DO_NOW",
                null
            ));

            recommendedSafeActions.add(new SafeAction(
                "sa_verify_evidence",
                "Preserve Message Evidence",
                "Keep original unedited screenshots showing group names and numbers in case formal reporting is required.",
                SafeActionType.PRESERVE_EVIDENCE,
                "VERIFY_BEFORE_ACTING",
                null
            ));
        }

        return new EvidenceEvaluationResult(evidenceItems, uncertaintyItems, recommendedSafeActions);
    }
}
