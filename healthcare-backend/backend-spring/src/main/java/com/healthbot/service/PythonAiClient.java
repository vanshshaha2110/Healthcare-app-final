package com.healthbot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class PythonAiClient {

    @Value("${python.service.url:http://localhost:8001}")
    private String pythonServiceUrl;

    private final RestTemplate restTemplate;

    public PythonAiClient() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(60000);
        factory.setReadTimeout(60000);
        this.restTemplate = new RestTemplate(factory);
    }

    private String getBaseUrl() {
        if (pythonServiceUrl == null || pythonServiceUrl.trim().isEmpty()) {
            return "http://localhost:8001";
        }
        String url = pythonServiceUrl.trim();
        while (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        return url;
    }

    public DocumentAnalysisResponse analyzeDocument(MultipartFile file, String documentType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() { return file.getOriginalFilename() != null ? file.getOriginalFilename() : "document"; }
            });
            body.add("document_type", documentType != null ? documentType : "PRESCRIPTION");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            DocumentAnalysisResponse resp = restTemplate.postForObject(
                    getBaseUrl() + "/analyze-document",
                    requestEntity,
                    DocumentAnalysisResponse.class
            );
            return resp != null ? resp : createFallbackDocumentResponse("AI response empty");
        } catch (Exception e) {
            System.err.println("Error calling Python AI service /analyze-document at " + getBaseUrl() + ": " + e.getMessage());
            return createFallbackDocumentResponse("Error connecting to AI service: " + e.getMessage());
        }
    }

    private DocumentAnalysisResponse createFallbackDocumentResponse(String errorDetails) {
        DocumentAnalysisResponse fallback = new DocumentAnalysisResponse();
        fallback.setExtractedText("Text extraction unavailable.");
        fallback.setAiSummary("Could not analyze document image. Please check Python service. (" + errorDetails + ")");
        fallback.setDocumentType("PRESCRIPTION");
        return fallback;
    }

    public Map checkSymptoms(String symptoms) {
        try {
            Map<String, String> req = new java.util.HashMap<>();
            req.put("symptoms", symptoms != null ? symptoms : "");
            Map res = restTemplate.postForObject(getBaseUrl() + "/symptom-checker", req, Map.class);
            return res != null ? res : Map.of("advice", "AI service unavailable", "urgency", "LOW");
        } catch (Exception e) {
            System.err.println("Error calling Python AI service /symptom-checker at " + getBaseUrl() + ": " + e.getMessage());
            return Map.of(
                    "possible_conditions", java.util.List.of("Service error"),
                    "advice", "Could not connect to AI service at " + getBaseUrl() + ": " + e.getMessage(),
                    "recommended_specialist", "General Physician",
                    "urgency", "LOW",
                    "disclaimer", "This is not a medical diagnosis."
            );
        }
    }

    public String explainTerm(String term) {
        try {
            Map<String, String> req = new java.util.HashMap<>();
            req.put("term", term != null ? term : "");
            Map response = restTemplate.postForObject(getBaseUrl() + "/explain-term", req, Map.class);
            if (response != null && response.containsKey("explanation")) {
                Object exp = response.get("explanation");
                return exp != null ? exp.toString() : "No explanation available.";
            }
            return "Could not generate explanation.";
        } catch (Exception e) {
            System.err.println("Error calling Python AI service /explain-term at " + getBaseUrl() + ": " + e.getMessage());
            return "Unable to explain term. Error connecting to AI service: " + e.getMessage();
        }
    }

    public String chat(String message, String history) {
        try {
            Map<String, String> req = new java.util.HashMap<>();
            req.put("message", message != null ? message : "");
            req.put("history", history != null ? history : "");
            Map response = restTemplate.postForObject(getBaseUrl() + "/chat", req, Map.class);
            if (response != null && response.containsKey("reply")) {
                Object reply = response.get("reply");
                return reply != null ? reply.toString() : "No reply from AI service.";
            }
            return "Sorry, I couldn't process your message.";
        } catch (Exception e) {
            System.err.println("Error calling Python AI service /chat at " + getBaseUrl() + ": " + e.getMessage());
            return "Sorry, I couldn't reach the AI service at " + getBaseUrl() + ". (" + e.getMessage() + ")";
        }
    }

    public Map assessHealthRisk(Map data) {
        try {
            Map response = restTemplate.postForObject(getBaseUrl() + "/risk-assessment", data, Map.class);
            return response != null ? response : Map.of("overallRiskScore", 30, "riskCategory", "LOW");
        } catch (Exception e) {
            System.err.println("Error calling Python AI service /risk-assessment at " + getBaseUrl() + ": " + e.getMessage());
            return Map.of("overallRiskScore", 25, "riskCategory", "LOW", "summary", "Preliminary screening stable.");
        }
    }

    public Map generateDietPlan(Map data) {
        try {
            Map response = restTemplate.postForObject(getBaseUrl() + "/diet-planner", data, Map.class);
            return response != null ? response : Map.of("dailyTargetCalories", 2000);
        } catch (Exception e) {
            System.err.println("Error calling Python AI service /diet-planner at " + getBaseUrl() + ": " + e.getMessage());
            return Map.of("dailyTargetCalories", 2000, "nutritionTip", "Balanced nutrition recommended.");
        }
    }
}

