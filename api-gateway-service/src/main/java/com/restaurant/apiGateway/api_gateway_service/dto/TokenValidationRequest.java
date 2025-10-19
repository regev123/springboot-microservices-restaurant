package com.restaurant.apiGateway.api_gateway_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Data Transfer Object (DTO) used for validating JWT tokens.
 *
 * <p>
 * This object is used to verify whether a JWT token is still valid by
 * comparing its {@code issuedAt} timestamp with the user's last password
 * modification date stored in the database.
 * </p>
 *
 * <p><b>Usage:</b> This DTO is typically sent to the authentication service
 * to validate token timestamps and ensure tokens haven't been invalidated
 * due to password changes.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenValidationRequest {

    /**
     * The email address of the user whose token needs to be validated.
     * <p>Must be provided and follow a valid email format.</p>
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    /**
     * The timestamp when the JWT token was issued.
     * <p>
     * Must:
     * <ul>
     *   <li>Not be null</li>
     *   <li>Be a past or present timestamp (future timestamps are invalid)</li>
     * </ul>
     * </p>
     */
    @NotNull(message = "IssuedAt timestamp is required")
    private Instant issuedAt;
}