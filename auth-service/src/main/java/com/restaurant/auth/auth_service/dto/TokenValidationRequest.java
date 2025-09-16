package com.restaurant.auth.auth_service.dto;

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
 */
@Data
@NoArgsConstructor      // Required for JSON deserialization
@AllArgsConstructor     // Convenient for creating instances manually
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
