package com.sri_tel.bff.controller;

import com.sri_tel.bff.DTO.ApiResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
public class ErrorHandlerController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<?> handleError() {
        // Example of a JSON error response
        return new ResponseEntity<>(
                new ApiResponse<>(false, HttpStatus.NOT_FOUND.value(), "Resource not found", null),
                HttpStatus.NOT_FOUND);
    }
    public String getErrorPath() {
        return "/error";
    }
}
