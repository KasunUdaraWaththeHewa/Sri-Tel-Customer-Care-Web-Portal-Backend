package com.sri_tel.bff.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sri_tel.bff.DTO.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Map;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    @Value("${core.customer.management.url}")
    private String customerManagementUrl;

    @Value("${core.billing.service.url}")
    private String billingServiceUrl;

    @Value("${core.payment.service.url}")
    private String paymentServiceUrl;

    @Value("${core.notification.service.url}")
    private String notificationServiceUrl;

    @Value("${core.chat.service.url}")
    private String chatServiceUrl;

    @Value("${core.auth.service.url}")
    private String authServiceUrl;

    @Value("${core.image.upload.service.url}")
    private String imageUploadServiceUrl;

    @Value("${core.value.added.service.url}")
    private String valueAddedServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(ProxyController.class);

    // Forward GET Requests
    @GetMapping("/forward/**")
    public ResponseEntity<?> forwardGetRequest(
            @RequestHeader("Authorization") String token,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, null, HttpMethod.GET);
    }

    // Forward POST Requests
    @PostMapping("/forward/**")
    public ResponseEntity<?> forwardPostRequest(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, requestBody, HttpMethod.POST);
    }

    // Forward PUT Requests
    @PutMapping("/forward/**")
    public ResponseEntity<?> forwardPutRequest(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, requestBody, HttpMethod.PUT);
    }

    // Forward DELETE Requests
    @DeleteMapping("/forward/**")
    public ResponseEntity<?> forwardDeleteRequest(
            @RequestHeader("Authorization") String token,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, null, HttpMethod.DELETE);
    }

    // Forward PATCH Requests
    @PatchMapping("/forward/**")
    public ResponseEntity<?> forwardPatchRequest(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, requestBody, HttpMethod.PATCH);
    }

    // Determine which backend service to use based on request URI
    private String determineBackendUrl(String requestUri) {
        if (requestUri.startsWith("/customers")) {
            return customerManagementUrl;
        } else if (requestUri.startsWith("/billing")) {
            return billingServiceUrl;
        } else if (requestUri.startsWith("/payments")) {
            return paymentServiceUrl;
        } else if (requestUri.startsWith("/notifications")) {
            return notificationServiceUrl;
        } else if (requestUri.startsWith("/chat")) {
            return chatServiceUrl;
        } else if (requestUri.startsWith("/auth")) {
            return authServiceUrl;
        } else if (requestUri.startsWith("/images")) {
            return imageUploadServiceUrl;
        } else if (requestUri.startsWith("/value-added")) {
            return valueAddedServiceUrl;
        }
        return null;
    }

    // Forward request with token
    private ResponseEntity<?> forwardRequestWithToken(
            String backendUrl, String token, Object body, HttpMethod method) {

        // First, validate the token using the Auth Service
        if (!validateToken(token)) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.UNAUTHORIZED.value(), "Invalid token", null));
        }

        // If token is valid, forward the request to the microservice
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);  // Pass the token to the Billing Service
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(backendUrl, method, entity, String.class);

            // Parse the backend response to an object
            ApiResponse<?> backendResponse = objectMapper.readValue(response.getBody(), new TypeReference<>() {});

            return ResponseEntity.ok(new ApiResponse<>(true, backendResponse.getStatusCode(), backendResponse.getMessage(), backendResponse.getData()));
        } catch (Exception e) {
            logger.error("Error forwarding request: ", e);
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal server error", null));
        }
    }



    // Validate token before forwarding
    private boolean validateToken(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);  // Pass the token for validation

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Validate token by making a GET request to the Auth Service
            ResponseEntity<ApiResponse<?>> response = restTemplate.exchange(
                    authServiceUrl + "/validate-token", HttpMethod.GET, entity, new ParameterizedTypeReference<>() {});

            return response.getBody() != null && response.getBody().isSuccess();
        } catch (Exception e) {
            logger.error("Token validation failed: ", e);
            return false;
        }
    }

}
