package com.sangyan.investorsafety;

import com.sangyan.investorsafety.domain.model.SafetyAnalysisResult;
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
    void analysisEndpointAcceptsValidText() {
        AnalysisRequest request = new AnalysisRequest("Pay ₹5,000 registration fee today.");
        ResponseEntity<AnalysisResponse> response = restTemplate.postForEntity("/api/v1/analysis", request, AnalysisResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().claims()).isNotEmpty();
        assertThat(response.getBody().riskSignals()).isNotEmpty();
        assertThat(response.getBody().recommendedSafeActions()).isNotEmpty();
    }

    @Test
    void analysisEndpointHandlesBlankInput() {
        AnalysisRequest request = new AnalysisRequest("   ");
        ResponseEntity<String> response = restTemplate.postForEntity("/api/v1/analysis", request, String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
