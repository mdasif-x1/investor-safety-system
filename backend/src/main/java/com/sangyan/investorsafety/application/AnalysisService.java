package com.sangyan.investorsafety.application;

import com.sangyan.investorsafety.domain.model.Claim;
import com.sangyan.investorsafety.domain.model.ClaimCategory;
import com.sangyan.investorsafety.domain.model.EvidenceStatus;
import com.sangyan.investorsafety.domain.model.RiskSignal;
import com.sangyan.investorsafety.domain.model.SafetyAnalysisResult;
import com.sangyan.investorsafety.domain.model.SignalSeverity;
import com.sangyan.investorsafety.domain.port.EvidenceProvider;
import com.sangyan.investorsafety.domain.port.EvidenceRequest;
import com.sangyan.investorsafety.domain.port.EvidenceResponse;
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

        EvidenceRequest evidenceRequest = new EvidenceRequest(claims, riskSignals);
        EvidenceResponse evalResult = evidenceProvider.evaluateEvidenceAndUncertainty(evidenceRequest);

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

        // 1. Regulatory Identity Claim
        Pattern sebiPattern = Pattern.compile("(sebi\\s+registered\\s+[a-z0-9_-]+|sebi\\s+expert|sebi\\s+approved|sebi\\s+registered|registered\\s+analyst|sebi\\s+se\\s+approved|sebi\\s+registered\\s+hu|सेबी|approved\\s+advisor)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher sebiMatcher = sebiPattern.matcher(text);
        if (sebiMatcher.find()) {
            claims.add(new Claim(
                "cl_sebi_1",
                "The message claims SEBI registration or regulatory approval status.",
                ClaimCategory.REGULATORY_IDENTITY,
                text,
                "Sender explicitly asserts that they hold official SEBI registration or approval.",
                EvidenceStatus.UNVERIFIED
            ));
        }

        // 2. Guaranteed Return Claim
        Pattern returnPattern = Pattern.compile("(guaranteed|assured|100%|fixed|fix|garanti|pukka|pakka)\\s+(returns?|profits?|income|monthly|daily|[0-9]+%|munafa|kamai|return)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher returnMatcher = returnPattern.matcher(text);
        if (returnMatcher.find()) {
            claims.add(new Claim(
                "cl_return_1",
                "The message promises guaranteed or fixed financial returns.",
                ClaimCategory.GUARANTEED_RETURN,
                returnMatcher.group(0),
                "Sender asserts specific fixed profit margins or returns on investments.",
                EvidenceStatus.UNVERIFIED
            ));
        }

        // 3. Payment Request Claim
        Pattern paymentPattern = Pattern.compile("(?:deposit|pay|transfer|send|bhej|bhejo|daalo|daldo|de|dedo)\\s+(?:the\\s+)?(?:registration\\s+|joining\\s+|advisory\\s+)?(?:fee|amount|deposit|money|paise|rs|rupees|₹)?\\s*(?:of\\s+)?(?:rupees|rs\\.?|inr|₹|k)?\\s*\\d+|\\d+\\s*(?:k|thousand|lakh|rupees|rs|inr|₹)\\s*(?:bhej|bhejo|pay|deposit|transfer|daalo)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher paymentMatcher = paymentPattern.matcher(text);
        if (paymentMatcher.find()) {
            claims.add(new Claim(
                "cl_payment_1",
                "The message contains a request for an upfront payment or deposit.",
                ClaimCategory.PAYMENT_REQUEST,
                paymentMatcher.group(0),
                "The text explicitly requests a financial transfer or fee deposit.",
                EvidenceStatus.UNVERIFIED
            ));
        }

        // 4. Off-Platform Group Invitation Claim
        Pattern groupPattern = Pattern.compile("(join\\s+telegram|vip\\s+group|whatsapp\\s+group|telegram\\s+group|telegram|t\\.me\\/|chat\\.whatsapp\\.com|grp\\s+join|group\\s+join|telegram\\s+join)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher groupMatcher = groupPattern.matcher(text);
        if (groupMatcher.find()) {
            claims.add(new Claim(
                "cl_group_1",
                "The message invites participation in a private messaging group (Telegram / WhatsApp).",
                ClaimCategory.OFF_PLATFORM_INVITATION,
                groupMatcher.group(0),
                "Sender redirects conversation into private channels where identity oversight is limited.",
                EvidenceStatus.UNVERIFIED
            ));
        }

        return claims;
    }

    private List<RiskSignal> evaluateRiskSignals(String text) {
        List<RiskSignal> signals = new ArrayList<>();

        // R01 — Guaranteed Return Rule
        Pattern returnPattern = Pattern.compile("(guaranteed|assured|100%|fixed|fix|garanti|pukka|pakka)\\s+(returns?|profits?|income|monthly|daily|[0-9]+%|munafa|kamai|return)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher returnMatcher = returnPattern.matcher(text);
        if (returnMatcher.find() && !isNegatedOrEducational(text, returnMatcher.start())) {
            signals.add(new RiskSignal(
                "sig_r01",
                "GUARANTEED_RETURN",
                "Guaranteed Return Pattern",
                "The message promises guaranteed or fixed financial returns. Official SEBI guidance warns that guaranteed return promises on equity investments carry high risk.",
                SignalSeverity.HIGH,
                returnMatcher.group(0),
                "cl_return_1"
            ));
        }

        // R02 — Urgency Pressure Rule
        Pattern urgencyPattern = Pattern.compile("(limited\\s+seats|act\\s+fast|today\\s+only|hurry|last\\s+chance|immediate\\s+join|aaj\\s+hi|jaldi|khatam|offer\\s+khatam|limited\\s+seat)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher urgencyMatcher = urgencyPattern.matcher(text);
        if (urgencyMatcher.find() && !isNegatedOrEducational(text, urgencyMatcher.start())) {
            signals.add(new RiskSignal(
                "sig_r02",
                "URGENCY_PRESSURE",
                "Artificial Urgency Pressure Pattern",
                "The message uses deadline pressure phrases. Creating artificial urgency reduces time to independently verify credentials before taking action.",
                SignalSeverity.HIGH,
                urgencyMatcher.group(0),
                null
            ));
        }

        // R03 — Direct Payment Request Rule
        Pattern paymentPattern = Pattern.compile("(?:deposit|pay|transfer|send|bhej|bhejo|daalo|daldo|de|dedo)\\s+(?:the\\s+)?(?:registration\\s+|joining\\s+|advisory\\s+)?(?:fee|amount|deposit|money|paise|rs|rupees|₹)?\\s*(?:of\\s+)?(?:rupees|rs\\.?|inr|₹|k)?\\s*\\d+|\\d+\\s*(?:k|thousand|lakh|rupees|rs|inr|₹)\\s*(?:bhej|bhejo|pay|deposit|transfer|daalo)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
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

        // R04 — Regulatory Identity Claim Rule
        Pattern sebiPattern = Pattern.compile("(sebi\\s+registered\\s+[a-z0-9_-]+|sebi\\s+expert|sebi\\s+approved|sebi\\s+registered|registered\\s+analyst|sebi\\s+se\\s+approved|sebi\\s+registered\\s+hu|सेबी|approved\\s+advisor)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher sebiMatcher = sebiPattern.matcher(text);
        if (sebiMatcher.find() && !isNegatedOrEducational(text, sebiMatcher.start())) {
            signals.add(new RiskSignal(
                "sig_r04",
                "REGULATORY_IDENTITY_CLAIM",
                "Unverified Regulatory Identity Claim Pattern",
                "The message mentions SEBI registration or approval; this regulatory reference requires independent verification on official public registers.",
                SignalSeverity.MEDIUM,
                sebiMatcher.group(0),
                "cl_sebi_1"
            ));
        }

        // R05 — Off-Platform Redirection Rule
        Pattern groupPattern = Pattern.compile("(join\\s+telegram|vip\\s+group|whatsapp\\s+group|telegram\\s+group|telegram|t\\.me\\/|chat\\.whatsapp\\.com|grp\\s+join|group\\s+join|telegram\\s+join)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher groupMatcher = groupPattern.matcher(text);
        if (groupMatcher.find() && !isNegatedOrEducational(text, groupMatcher.start())) {
            signals.add(new RiskSignal(
                "sig_r05",
                "OFF_PLATFORM_REDIRECTION",
                "Off-Platform Group Redirection Pattern",
                "The message invites participation in private messaging channels (Telegram/WhatsApp) where identity oversight is limited.",
                SignalSeverity.MEDIUM,
                groupMatcher.group(0),
                "cl_group_1"
            ));
        }

        return signals;
    }

    private boolean isNegatedOrEducational(String text, int matchIndex) {
        int windowStart = Math.max(0, matchIndex - 120);
        int windowEnd = Math.min(text.length(), matchIndex + 120);
        String snippet = text.substring(windowStart, windowEnd).toLowerCase();

        List<String> negationPhrases = List.of(
            "not promised",
            "are not promised",
            "never promised",
            "no guaranteed",
            "not guaranteed",
            "nahi milega",
            "nahi milta",
            "garanti nahi",
            "never share your",
            "dont share",
            "don't share",
            "never pay",
            "never transfer",
            "paise mat bhejo",
            "mat bhej",
            "educational purposes only",
            "educational guide",
            "learn about common investment scams",
            "learn about payment scams",
            "learn about",
            "how fake investment",
            "explain mutual fund risks",
            "trick investors",
            "scammers often",
            "scam awareness"
        );

        return negationPhrases.stream().anyMatch(snippet::contains);
    }
}
