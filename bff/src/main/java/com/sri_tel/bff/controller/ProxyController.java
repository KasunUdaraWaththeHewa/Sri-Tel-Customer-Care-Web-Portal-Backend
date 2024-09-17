package com.sri_tel.bff.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sri_tel.bff.DTO.ApiResponse;
import com.sri_tel.bff.service.JwtService;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.util.MultiValueMap;
import org.springframework.util.LinkedMultiValueMap;




import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.http.HttpHeaders;


import com.sri_tel.bff.util.MultipartFileResource;

import java.io.IOException;
// import java.net.http.HttpHeaders;
import java.util.Map;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    @Value("${core.customer.service.url}")
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

    @Value("${core.upload.service.url}")
    private String imageUploadServiceUrl;

    @Value("${core.value.added.service.url}")
    private String valueAddedServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(ProxyController.class);

    // Method to validate token
    private boolean validateToken(String token) {
        try {
            jwtService.validateJwtToken(token);
            logger.info("JWT token is valid");
            return true;
        } catch (SignatureException | MalformedJwtException e) {
            logger.error("JWT validation error: ", e);
            return false;
        } catch (Exception e) {
            logger.error("Unexpected error during JWT validation: ", e);
            return false;
        }
    }
    // Forward GET Requests
    @GetMapping("/forward/**")
    public ResponseEntity<?> forwardGetRequest(
            @RequestHeader(value = "Authorization", required = false) String token,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        // Skip token validation for auth endpoints (login/signup)
        if (isAuthEndpoint(requestUri)) {
            return forwardRequestWithoutToken(backendUrl + requestUri, HttpMethod.GET);
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, null, HttpMethod.GET);
    }

    // Forward POST Requests
    @PostMapping("/forward/**")
    public ResponseEntity<?> forwardPostRequest(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        // Skip token validation for auth endpoints (login/signup)
        if (isAuthEndpoint(requestUri)) {
            return forwardRequestWithoutToken(backendUrl + requestUri, HttpMethod.POST, requestBody);
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, requestBody, HttpMethod.POST);
    }

    // Forward PUT Requests
    @PutMapping("/forward/**")
    public ResponseEntity<?> forwardPutRequest(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        // Skip token validation for auth endpoints (login/signup)
        if (isAuthEndpoint(requestUri)) {
            return forwardRequestWithoutToken(backendUrl + requestUri, HttpMethod.PUT, requestBody);
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, requestBody, HttpMethod.PUT);
    }

    // Forward DELETE Requests
    @DeleteMapping("/forward/**")
    public ResponseEntity<?> forwardDeleteRequest(
            @RequestHeader(value = "Authorization", required = false) String token,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        // Skip token validation for auth endpoints (login/signup)
        if (isAuthEndpoint(requestUri)) {
            return forwardRequestWithoutToken(backendUrl + requestUri, HttpMethod.DELETE);
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, null, HttpMethod.DELETE);
    }

    // Forward PATCH Requests
    @PatchMapping("/forward/**")
    public ResponseEntity<?> forwardPatchRequest(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {

        String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
        String backendUrl = determineBackendUrl(requestUri);

        if (backendUrl == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Service not found", null));
        }

        // Skip token validation for auth endpoints (login/signup)
        if (isAuthEndpoint(requestUri)) {
            return forwardRequestWithoutToken(backendUrl + requestUri, HttpMethod.PATCH, requestBody);
        }

        return forwardRequestWithToken(backendUrl + requestUri, token, requestBody, HttpMethod.PATCH);
    }



    @PostMapping("/forward/upload/**")
    public ResponseEntity<?> forwardUploadRequest(
        @RequestHeader("Authorization") String token,
        HttpServletRequest request) {

    String requestUri = request.getRequestURI().replace("/api/proxy/forward", "");
    String backendUrl = imageUploadServiceUrl + requestUri;

    // Token validation
    if (!validateToken(token)) {
        return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.UNAUTHORIZED.value(), "Invalid token", null));
    }

    // Extract user ID and role from the token
    Map<String, Object> claims = jwtService.getClaimsFromToken(token);
    String userId = (String) claims.get("_id");
    String role = (String) claims.get("role");

    // Check if the request is a multipart request
    if (!(request instanceof MultipartHttpServletRequest)) {
        return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.BAD_REQUEST.value(), "Request is not multipart", null));
    }

    MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

    // Prepare headers
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA);
    headers.set("Authorization", token);
    headers.set("user_id", userId);
    headers.set("role", role);

    // Build the body of the request
    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

    // Add form fields
    multipartRequest.getParameterMap().forEach((key, values) -> {
        for (String value : values) {
            body.add(key, value);
        }
    });

    // Add files
// Add files
    multipartRequest.getFileMap().forEach((key, file) -> {
        try {
            body.add(key, new MultipartFileResource(file));
        } catch (IOException e) {
            logger.error("Error processing multipart file", e);
            throw new RuntimeException("Error processing multipart file", e);
        }
    });


    HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

    try {
        ResponseEntity<String> response = restTemplate.exchange(backendUrl, HttpMethod.POST, entity, String.class);
        ApiResponse<?> backendResponse = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
        return ResponseEntity.ok(new ApiResponse<>(true, backendResponse.getStatusCode(), backendResponse.getMessage(), backendResponse.getData()));
    } catch (Exception e) {
        logger.error("Error forwarding request: ", e);
        return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal server error", null));
    }
}

    // Determine which backend service to use based on request URI
    private String determineBackendUrl(String requestUri) {
        if (requestUri.startsWith("/customer")) {
            return customerManagementUrl;
        } else if (requestUri.startsWith("/billing")) {
            return billingServiceUrl;
        } else if (requestUri.startsWith("/payment")) {
            return paymentServiceUrl;
        } else if (requestUri.startsWith("/notification")) {
            return notificationServiceUrl;
        } else if (requestUri.startsWith("/chat")) {
            return chatServiceUrl;
        } else if (requestUri.startsWith("/user")) {
            return authServiceUrl;
        } else if (requestUri.startsWith("/upload")) {
            return imageUploadServiceUrl;
        } else if (requestUri.startsWith("/value-added")) {
            return valueAddedServiceUrl;
        }
        return null;
    }

    // Forward request with token
    private ResponseEntity<?> forwardRequestWithToken(
            String backendUrl, String token, Object body, HttpMethod method) {

        // Check if token is missing
        if (token == null || token.isEmpty()) {
            logger.error("Token is missing");
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.UNAUTHORIZED.value(), "Authorization token is missing", null));
        }

        // Validate the token
        if (!validateToken(token)) {
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.UNAUTHORIZED.value(), "Invalid token", null));
        }

        // Extract _id and role from the token
        Map<String, Object> claims = jwtService.getClaimsFromToken(token);
        String userId = (String) claims.get("_id");
        String role = (String) claims.get("role");

        // If token is valid, forward the request to the microservice with additional headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("user_id", userId);
        headers.set("role", role);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(backendUrl, method, entity, String.class);
            // Parse the backend response to an object
            ApiResponse<?> backendResponse = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            logger.info("Received response from chat service: " + response.getBody());
            return ResponseEntity.ok(new ApiResponse<>(true, backendResponse.getStatusCode(), backendResponse.getMessage(), backendResponse.getData()));

        } catch (Exception e) {
            logger.error("Error forwarding request: ", e);
            return ResponseEntity.ok(new ApiResponse<>(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal server error", null));
        }
    }

    // Helper method to check if the request is for an Auth endpoint
    private boolean isAuthEndpoint(String requestUri) {
        return requestUri.contains("/user/login") || requestUri.contains("/user/signup")
                || requestUri.contains("/user/forgotpassword") || requestUri.contains("/user/resetpassword")
                || requestUri.contains("/user/changepassword");
    }

    // Forward request without token validation
    private ResponseEntity<?> forwardRequestWithoutToken(
            String backendUrl, HttpMethod method) {
        return forwardRequestWithoutToken(backendUrl, method, null);
    }

    // Forward request without token validation (with body)
    private ResponseEntity<?> forwardRequestWithoutToken(
            String backendUrl, HttpMethod method, Object body) {

        HttpHeaders headers = new HttpHeaders();
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



}