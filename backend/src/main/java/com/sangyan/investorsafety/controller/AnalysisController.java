package com.sangyan.investorsafety.controller;

import com.sangyan.investorsafety.application.AnalysisService;
import com.sangyan.investorsafety.domain.model.SafetyAnalysisResult;
import com.sangyan.investorsafety.dto.request.AnalysisRequest;
import com.sangyan.investorsafety.dto.response.AnalysisResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping
    public ResponseEntity<AnalysisResponse> analyze(@Valid @RequestBody AnalysisRequest request) {
        SafetyAnalysisResult result = analysisService.analyzeText(request.text());
        return ResponseEntity.ok(AnalysisResponse.fromDomain(result));
    }
}
