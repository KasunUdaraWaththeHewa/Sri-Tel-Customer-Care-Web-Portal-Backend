package com.sri_tel.bff.exception;

import com.sri_tel.bff.DTO.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handle HTTP Client errors (e.g., 4xx responses)
    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpClientError(HttpClientErrorException e) {
        logger.error("Client error: {}", e.getMessage(), e);
        return new ResponseEntity<>(
                new ApiResponse<>(false, e.getStatusCode().value(), e.getMessage(), null),
                e.getStatusCode());
    }

    // Handle HTTP Server errors (e.g., 5xx responses)
    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpServerError(HttpServerErrorException e) {
        logger.error("Server error: {}", e.getMessage(), e);
        return new ResponseEntity<>(
                new ApiResponse<>(false, e.getStatusCode().value(), e.getMessage(), null),
                e.getStatusCode());
    }

    // Catch all other exceptions (e.g., NullPointerException)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception e) {
        logger.error("An error occurred: {}", e.getMessage(), e);
        return new ResponseEntity<>(
                new ApiResponse<>(false, HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal server error", null),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
