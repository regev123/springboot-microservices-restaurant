package com.restaurant.apiGateway.api_gateway_service.exception;

public class TokenValidationException extends RuntimeException {
    public TokenValidationException(String message) {
        super(message);
    }
}
