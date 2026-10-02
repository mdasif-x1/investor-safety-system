package com.sangyan.investorsafety.application;

import com.sangyan.investorsafety.domain.model.Claim;
import com.sangyan.investorsafety.domain.model.ClaimCategory;
import com.sangyan.investorsafety.domain.model.EvidenceStatus;
import com.sangyan.investorsafety.domain.model.RiskSignal;
import com.sangyan.investorsafety.domain.model.SafetyAnalysisResult;
import com.sangyan.investorsafety.domain.model.SignalSeverity;
import com.sangyan.investorsafety.domain.port.EvidenceProvider;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AnalysisService {

    private final EvidenceProvider evidenceProvider;

    public AnalysisService(EvidenceProvider evidenceProvider) {
        this.evidenceProvider = evidenceProvider;
    }

    public SafetyAnalysisResult analyzeText(String text) {
        String normalizedText = text == null ? "" : text.trim();
        String analysisId = "ANL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        List<Claim> claims = extractClaims(normalizedText);
        List<RiskSignal> riskSignals = evaluateRiskSignals(normalizedText);

        EvidenceProvider.EvidenceEvaluationResult evalResult =
            evidenceProvider.evaluateEvidenceAndUncertainty(claims, riskSignals);

        String uncertaintyExplanation = !riskSignals.isEmpty()
            ? "This message contains characteristics that deserve caution. The system has not established that the sender is fraudulent, but identity and credentials remain unverified."
            : "No major warning patterns were detected in the submitted text. Absence of detected warning patterns does not independently prove that the offer or sender is legitimate.";

        return new SafetyAnalysisResult(
            analysisId,
            Instant.now().toString(),
            "COMPLETED",
            normalizedText,
            normalizedText,
            claims,
            riskSignals,
            evalResult.evidenceItems(),
            evalResult.uncertaintyItems(),
            uncertaintyExplanation,
            evalResult.recommendedSafeActions()
        );
    }

    private List<Claim> extractClaims(String text) {
        List<Claim> claims = new ArrayList<>();

        // Regulatory claim
        Pattern sebiPattern = Pattern.compile("(sebi\\s+registered\\s+[a-z]+|sebi\\s+expert|sebi\\s+approved|registered\\s+analyst)", Pattern.CASE_INSENSITIVE);
        Matcher sebiMatcher = sebiPattern.matcher(text);
        if (sebiMatcher.find()) {
            claims.add(new Claim(
                "cl_sebi_1",
                "The message claims SEBI registration or regulatory approval status.",
                ClaimCategory.REGULATORY_IDENTITY,
                sebiMatcher.group(0),
                "Sender explicitly asserts that they hold official SEBI registration or approval.",
                EvidenceStatus.UNVERIFIED
            ));
        }

        // Guaranteed return claim
        Pattern returnPattern = Pattern.compile("(guaranteed|assured|100%|fixed)\\s+(returns?|profits?|income|monthly|daily)", Pattern.CASE_INSENSITIVE);
        Matcher returnMatcher = returnPattern.matcher(text);
        if (returnMatcher.find()) {
            claims.add(new Claim(
                "cl_return_1",
                "The message promises guaranteed or fixed financial returns.",
                ClaimCategory.GUARANTEED_RETURN,
                returnMatcher.group(0),
                "Sender asserts specific fixed profit margins on stock investments.",
                EvidenceStatus.UNVERIFIED
            ));
        }

        // Payment claim
        Pattern paymentPattern = Pattern.compile("(?:deposit|pay|transfer|send)\\s+(?:the\\s+)?(?:registration\\s+|joining\\s+|advisory\\s+)?(?:fee|amount|deposit|money)?\\s*(?:of\\s+)?(?:rupees|rs\\.?|inr|₹)?\\s*\\d+", Pattern.CASE_INSENSITIVE);
        Matcher paymentMatcher = paymentPattern.matcher(text);
        if (paymentMatcher.find()) {
            claims.add(new Claim(
                "cl_payment_1",
                "The message contains a request for an upfront payment or deposit.",
                ClaimCategory.PAYMENT_REQUEST,
                paymentMatcher.group(0),
                "Sender requires a money transfer before unlocking stock tips or group access.",
                EvidenceStatus.UNVERIFIED
            ));
        }

        return claims;
    }

    private List<RiskSignal> evaluateRiskSignals(String text) {
        List<RiskSignal> signals = new ArrayList<>();

        Pattern paymentPattern = Pattern.compile("(?:deposit|pay|transfer|send)\\s+(?:the\\s+)?(?:registration\\s+|joining\\s+|advisory\\s+)?(?:fee|amount|deposit|money)?\\s*(?:of\\s+)?(?:rupees|rs\\.?|inr|₹)?\\s*\\d+", Pattern.CASE_INSENSITIVE);
        Matcher paymentMatcher = paymentPattern.matcher(text);
        if (paymentMatcher.find() && !isNegatedOrEducational(text, paymentMatcher.start())) {
            signals.add(new RiskSignal(
                "sig_r03",
                "DIRECT_PAYMENT_REQUEST",
                "Direct Upfront Payment Request Pattern",
                "The message contains a request to transfer money or pay a fee before accessing services.",
                SignalSeverity.HIGH,
                paymentMatcher.group(0),
                "cl_payment_1"
            ));
        }

        return signals;
    }

    private boolean isNegatedOrEducational(String text, int matchIndex) {
        int windowStart = Math.max(0, matchIndex - 80);
        int windowEnd = Math.min(text.length(), matchIndex + 80);
        String snippet = text.substring(windowStart, windowEnd).toLowerCase();

        List<String> negationPhrases = List.of(
            "not promised", "never pay", "never transfer", "educational purposes only",
            "learn about payment scams", "learn about", "scam awareness"
        );

        return negationPhrases.stream().anyMatch(snippet::contains);
    }
}
