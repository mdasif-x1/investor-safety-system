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
}
