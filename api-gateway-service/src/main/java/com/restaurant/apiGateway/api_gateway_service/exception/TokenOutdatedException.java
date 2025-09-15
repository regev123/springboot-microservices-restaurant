package com.restaurant.apiGateway.api_gateway_service.exception;

public class TokenOutdatedException extends RuntimeException {
    public TokenOutdatedException(String message) {
        super(message);
    }
}
