package com.restaurant.auth.auth_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for handling common application exceptions
 * and providing meaningful error responses to the client.
 */
@RestControllerAdvice
public class GlobalValidationExceptionsHandler {

    /**
     * Handles validation errors triggered by @Valid annotations.
     *
     * @param ex the MethodArgumentNotValidException containing validation errors
     * @return a response entity with a map of field names and their corresponding error messages
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    /**
     * Handles illegal argument exceptions, such as duplicate registration attempts
     * or invalid business logic input.
     *
     * @param ex the IllegalArgumentException instance
     * @return a response entity with the error message
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /**
     * Handles authentication failures due to invalid credentials.
     *
     * @param ex the InvalidCredentialsException instance
     * @return a response entity with the error message and 401 status
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    /**
     * Helper method to create consistent error responses.
     *
     * @param status  the HTTP status code
     * @param message the error message to include in the response
     * @return a standardized response entity
     */
    private ResponseEntity<Map<String, String>> buildErrorResponse(HttpStatus status, String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
