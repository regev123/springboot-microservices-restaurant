package com.restaurant.apiGateway.api_gateway_service.exception;

import com.restaurant.common.exception.GlobalExceptionHandler;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiGatewayServiceExceptionHandler extends GlobalExceptionHandler {
    // ========================= JWT SPECIFIC EXCEPTIONS ========================= //

    /**
     * Handles JWT expiration errors.
     */
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String, Object>> handleExpiredJwtException(ExpiredJwtException ex) {
        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "JWT Token Expired",
                "The provided token has expired. Please log in again."
        );
    }

    /**
     * Handles cases where the JWT is malformed (corrupted).
     */
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<Map<String, Object>> handleMalformedJwtException(MalformedJwtException ex) {
        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "Malformed JWT Token",
                "The provided token is malformed and cannot be processed."
        );
    }

    /**
     * Handles cases where the JWT format is unsupported.
     */
    @ExceptionHandler(UnsupportedJwtException.class)
    public ResponseEntity<Map<String, Object>> handleUnsupportedJwtException(UnsupportedJwtException ex) {
        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "Unsupported JWT Token",
                "The provided token format is not supported."
        );
    }

    /**
     * Handles cases where the JWT signature is invalid.
     */
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, Object>> handleSecurityException(SecurityException ex) {
        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "Invalid JWT Signature",
                "The JWT signature is invalid or has been tampered with."
        );
    }

    // ========================= CUSTOM TOKEN VALIDATION EXCEPTIONS ========================= //

    @ExceptionHandler(TokenOutdatedException.class)
    public ResponseEntity<Map<String, Object>> handleTokenOutdated(TokenOutdatedException ex) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Token Outdated", ex.getMessage());
    }

    @ExceptionHandler(TokenValidationException.class)
    public ResponseEntity<Map<String, Object>> handleTokenValidationError(TokenValidationException ex) {
        return buildErrorResponse(HttpStatus.BAD_GATEWAY, "Token Validation Error", ex.getMessage());
    }
}
