package com.sangyan.investorsafety;

import com.sangyan.investorsafety.dto.request.AnalysisRequest;
import com.sangyan.investorsafety.dto.response.AnalysisResponse;
import com.sangyan.investorsafety.dto.response.HealthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class InvestorSafetyApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void contextLoads() {
    }

    @Test
    void healthEndpointReturnsUp() {
        ResponseEntity<HealthResponse> response = restTemplate.getForEntity("/api/v1/health", HealthResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo("UP");
    }

    @Test
    void test1_DirectPaymentRequest() {
        AnalysisRequest request = new AnalysisRequest("Pay ₹5,000 registration fee today.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        AnalysisResponse body = response.getBody();
        assertThat(body.claims()).anyMatch(c -> "PAYMENT_REQUEST".equalsIgnoreCase(c.category().name()));
        assertThat(body.riskSignals()).anyMatch(s -> "DIRECT_PAYMENT_REQUEST".equalsIgnoreCase(s.code()));
        assertThat(body.recommendedSafeActions()).anyMatch(a -> "sa_do_now_payment".equalsIgnoreCase(a.id()));

        // Assert overclaiming fix: explanation MUST NOT mention unstated context like stock tips/groups
        String claimExplanation = body.claims().get(0).explanation();
        assertThat(claimExplanation).doesNotContain("stock tips");
        assertThat(claimExplanation).doesNotContain("group access");
        assertThat(claimExplanation).contains("financial transfer or fee deposit");
    }

    @Test
    void test2_GuaranteedReturn() {
        AnalysisRequest request = new AnalysisRequest("Guaranteed 20% monthly return.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.claims()).anyMatch(c -> "GUARANTEED_RETURN".equalsIgnoreCase(c.category().name()));
        assertThat(body.riskSignals()).anyMatch(s -> "GUARANTEED_RETURN".equalsIgnoreCase(s.code()));
    }

    @Test
    void test3_SebiIdentity() {
        AnalysisRequest request = new AnalysisRequest("We are SEBI registered investment advisors.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.claims()).anyMatch(c -> "REGULATORY_IDENTITY".equalsIgnoreCase(c.category().name()));
        assertThat(body.riskSignals()).anyMatch(s -> "REGULATORY_IDENTITY_CLAIM".equalsIgnoreCase(s.code()));
        assertThat(body.claims()).allMatch(c -> "UNVERIFIED".equalsIgnoreCase(c.evidenceStatus().name()));
    }

    @Test
    void test4_OffPlatform() {
        AnalysisRequest request = new AnalysisRequest("Join our private Telegram investment group.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.claims()).anyMatch(c -> "OFF_PLATFORM_INVITATION".equalsIgnoreCase(c.category().name()));
        assertThat(body.riskSignals()).anyMatch(s -> "OFF_PLATFORM_REDIRECTION".equalsIgnoreCase(s.code()));
    }

    @Test
    void test5_EducationalPayment() {
        AnalysisRequest request = new AnalysisRequest("Learn about payment scams that ask victims to deposit ₹5,000.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.riskSignals()).noneMatch(s -> "DIRECT_PAYMENT_REQUEST".equalsIgnoreCase(s.code()));
    }

    @Test
    void test6_NegatedPayment() {
        AnalysisRequest request = new AnalysisRequest("Never pay ₹5,000 to unknown UPI accounts.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.riskSignals()).noneMatch(s -> "DIRECT_PAYMENT_REQUEST".equalsIgnoreCase(s.code()));
    }

    @Test
    void test7_EducationalGuaranteedReturn() {
        AnalysisRequest request = new AnalysisRequest("Scammers often promise guaranteed returns of 20% daily.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.riskSignals()).noneMatch(s -> "GUARANTEED_RETURN".equalsIgnoreCase(s.code()));
    }

    @Test
    void test8_OrdinaryContent() {
        AnalysisRequest request = new AnalysisRequest("The market opens at 9:15 AM and closes at 3:30 PM.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.riskSignals()).isEmpty();
        assertThat(body.evidence()).isEmpty();
        assertThat(body.recommendedSafeActions()).isEmpty();
    }

    @Test
    void test9_MultiSignalMessage() {
        AnalysisRequest request = new AnalysisRequest("We are SEBI registered. Guaranteed 30% monthly return. Pay ₹5,000 today and join our private Telegram group.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.claims().size()).isGreaterThanOrEqualTo(3);
        assertThat(body.riskSignals().size()).isGreaterThanOrEqualTo(3);
        assertThat(body.recommendedSafeActions()).isNotEmpty();
    }

    // Phase 5.3 & 5.4 Verification Boundary Tests
    @Test
    void testPhase54_UnverifiedState_NoRegistrationNumber() {
        AnalysisRequest request = new AnalysisRequest("We are SEBI registered investment advisors.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.evidence()).anyMatch(e -> "INSUFFICIENT_INFORMATION".equalsIgnoreCase(e.status().name()));
        assertThat(body.evidence().get(0).explanation()).contains("does not specify an official registration number");
    }

    @Test
    void testPhase54_UnverifiedState_UnmappedRegistrationNumber() {
        AnalysisRequest request = new AnalysisRequest("We are SEBI registered entity INA00009999.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.evidence()).anyMatch(e -> "UNVERIFIED".equalsIgnoreCase(e.status().name()));
        assertThat(body.evidence().get(0).explanation()).contains("could not be independently matched to a definitive active official record");
    }

    @Test
    void testPhase54_SupportedAuthoritativeFixture() {
        AnalysisRequest request = new AnalysisRequest("We are SEBI registered entity INH000001234.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.evidence()).anyMatch(e -> "SUPPORTED".equalsIgnoreCase(e.status().name()));
        assertThat(body.evidence().get(0).explanation()).contains("[AUTHORITATIVE FIXTURE]");
    }

    @Test
    void testPhase54_ContradictedAuthoritativeFixture() {
        AnalysisRequest request = new AnalysisRequest("We are SEBI registered entity INH000099999.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisResponse body = response.getBody();
        assertThat(body.evidence()).anyMatch(e -> "CONTRADICTED".equalsIgnoreCase(e.status().name()));
        assertThat(body.evidence().get(0).explanation()).contains("[AUTHORITATIVE FIXTURE]");
    }

    // Phase 5.6.1 Dedicated Security & Reliability Regression Tests
    @Test
    void testPhase561_BlankInput_ReturnsBadRequest() {
        AnalysisRequest request = new AnalysisRequest("   ");
        ResponseEntity<com.sangyan.investorsafety.dto.response.ErrorResponse> response = restTemplate.postForEntity(
            "/api/v1/analysis", request, com.sangyan.investorsafety.dto.response.ErrorResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(400);
        assertThat(response.getBody().message()).contains("Text input cannot be blank");
    }

    @Test
    void testPhase561_OversizedInput_ReturnsBadRequest() {
        String longText = "A".repeat(10001);
        AnalysisRequest request = new AnalysisRequest(longText);
        ResponseEntity<com.sangyan.investorsafety.dto.response.ErrorResponse> response = restTemplate.postForEntity(
            "/api/v1/analysis", request, com.sangyan.investorsafety.dto.response.ErrorResponse.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(400);
        assertThat(response.getBody().message()).contains("Text input exceeds maximum length");
    }

    @Test
    void testPhase561_VerificationDisabled_ZeroNetworkCalls() {
        com.sangyan.investorsafety.infrastructure.evidence.MockEvidenceProvider mockProvider = 
            new com.sangyan.investorsafety.infrastructure.evidence.MockEvidenceProvider();
        
        org.springframework.web.client.RestClient spyRestClient = org.mockito.Mockito.spy(org.springframework.web.client.RestClient.builder().build());
        
        com.sangyan.investorsafety.infrastructure.evidence.OfficialRegistryEvidenceProvider provider = 
            new com.sangyan.investorsafety.infrastructure.evidence.OfficialRegistryEvidenceProvider(mockProvider, false, spyRestClient);

        com.sangyan.investorsafety.domain.model.Claim claim = new com.sangyan.investorsafety.domain.model.Claim(
            "c1", "We are SEBI registered entity INA00008888.", com.sangyan.investorsafety.domain.model.ClaimCategory.REGULATORY_IDENTITY, "INA00008888", "test", com.sangyan.investorsafety.domain.model.EvidenceStatus.UNVERIFIED
        );
        com.sangyan.investorsafety.domain.port.EvidenceRequest request = new com.sangyan.investorsafety.domain.port.EvidenceRequest(
            java.util.List.of(claim), java.util.List.of()
        );

        com.sangyan.investorsafety.domain.port.EvidenceResponse response = provider.evaluateEvidenceAndUncertainty(request);
        
        assertThat(response.evidenceItems()).anyMatch(e -> com.sangyan.investorsafety.domain.model.EvidenceStatus.UNVERIFIED.equals(e.status()));
        org.mockito.Mockito.verifyNoInteractions(spyRestClient);
    }

    @Test
    void testPhase561_ProviderTimeout_ReturnsSourceUnavailable() {
        com.sangyan.investorsafety.infrastructure.evidence.MockEvidenceProvider mockProvider = 
            new com.sangyan.investorsafety.infrastructure.evidence.MockEvidenceProvider();
        
        org.springframework.web.client.RestClient mockRestClient = org.mockito.Mockito.mock(org.springframework.web.client.RestClient.class);
        org.mockito.BDDMockito.given(mockRestClient.get()).willThrow(new org.springframework.web.client.ResourceAccessException("Read timed out"));

        com.sangyan.investorsafety.infrastructure.evidence.OfficialRegistryEvidenceProvider provider = 
            new com.sangyan.investorsafety.infrastructure.evidence.OfficialRegistryEvidenceProvider(mockProvider, true, mockRestClient);

        com.sangyan.investorsafety.domain.model.Claim claim = new com.sangyan.investorsafety.domain.model.Claim(
            "c1", "We are SEBI registered entity INA00007777.", com.sangyan.investorsafety.domain.model.ClaimCategory.REGULATORY_IDENTITY, "INA00007777", "test", com.sangyan.investorsafety.domain.model.EvidenceStatus.UNVERIFIED
        );
        com.sangyan.investorsafety.domain.port.EvidenceRequest request = new com.sangyan.investorsafety.domain.port.EvidenceRequest(
            java.util.List.of(claim), java.util.List.of()
        );

        com.sangyan.investorsafety.domain.port.EvidenceResponse response = provider.evaluateEvidenceAndUncertainty(request);
        
        assertThat(response.evidenceItems()).anyMatch(e -> com.sangyan.investorsafety.domain.model.EvidenceStatus.SOURCE_UNAVAILABLE.equals(e.status()));
        assertThat(response.evidenceItems()).noneMatch(e -> com.sangyan.investorsafety.domain.model.EvidenceStatus.CONTRADICTED.equals(e.status()));
        assertThat(response.evidenceItems()).noneMatch(e -> com.sangyan.investorsafety.domain.model.EvidenceStatus.SUPPORTED.equals(e.status()));
    }

    @Test
    void testPhase561_Provider5xx_ReturnsSourceUnavailable() {
        com.sangyan.investorsafety.infrastructure.evidence.MockEvidenceProvider mockProvider = 
            new com.sangyan.investorsafety.infrastructure.evidence.MockEvidenceProvider();
        
        org.springframework.web.client.RestClient mockRestClient = org.mockito.Mockito.mock(org.springframework.web.client.RestClient.class);
        org.mockito.BDDMockito.given(mockRestClient.get()).willThrow(new org.springframework.web.client.HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Server Error"));

        com.sangyan.investorsafety.infrastructure.evidence.OfficialRegistryEvidenceProvider provider = 
            new com.sangyan.investorsafety.infrastructure.evidence.OfficialRegistryEvidenceProvider(mockProvider, true, mockRestClient);

        com.sangyan.investorsafety.domain.model.Claim claim = new com.sangyan.investorsafety.domain.model.Claim(
            "c1", "We are SEBI registered entity INA00006666.", com.sangyan.investorsafety.domain.model.ClaimCategory.REGULATORY_IDENTITY, "INA00006666", "test", com.sangyan.investorsafety.domain.model.EvidenceStatus.UNVERIFIED
        );
        com.sangyan.investorsafety.domain.port.EvidenceRequest request = new com.sangyan.investorsafety.domain.port.EvidenceRequest(
            java.util.List.of(claim), java.util.List.of()
        );

        com.sangyan.investorsafety.domain.port.EvidenceResponse response = provider.evaluateEvidenceAndUncertainty(request);
        
        assertThat(response.evidenceItems()).anyMatch(e -> com.sangyan.investorsafety.domain.model.EvidenceStatus.SOURCE_UNAVAILABLE.equals(e.status()));
    }
}
