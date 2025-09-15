package com.restaurant.apiGateway.api_gateway_service.dto;

import lombok.RequiredArgsConstructor;

import java.time.Instant;

@RequiredArgsConstructor
public class TokenValidationRequest {
    private final String email;
    private final Instant issuedAt;
}
