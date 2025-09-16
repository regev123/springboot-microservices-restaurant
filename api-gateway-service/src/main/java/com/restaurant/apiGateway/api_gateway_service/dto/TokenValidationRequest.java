package com.restaurant.apiGateway.api_gateway_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenValidationRequest {
    private String email;
    private Instant issuedAt;
}