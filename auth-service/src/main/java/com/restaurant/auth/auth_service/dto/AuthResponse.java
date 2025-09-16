package com.restaurant.auth.auth_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object (DTO) representing the authentication response.
 *
 * <p>
 * This DTO is returned after a successful authentication or registration process.
 * It contains the generated JWT token that the client will use to
 * access protected resources.
 * </p>
 */
@Data
@NoArgsConstructor(force = true)
@RequiredArgsConstructor
public class AuthResponse {

    /**
     * The JSON Web Token (JWT) issued after successful authentication or registration.
     *
     * <p>
     * This token must be included in the `Authorization` header
     * of subsequent requests using the format:
     * <pre>
     * Authorization: Bearer {token}
     * </pre>
     * </p>
     */
    private final String token;
}
