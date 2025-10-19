package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.TokenValidationRequest;
import com.restaurant.auth.auth_service.service.TokenValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that provides JWT token validation endpoints.
 *
 * <p>
 * Verifies whether a JWT token remains valid based on the token's
 * {@code issuedAt} timestamp and the user's last password modification date.
 * </p>
 *
 * <p><b>Access Control:</b> Typically used internally by other services
 * to validate authentication state.</p>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class TokenController {

    private final TokenValidationService tokenValidationService;

    // ---------------------------------------------------------------------
    // Endpoint: Validate Token Timestamp
    // ---------------------------------------------------------------------

    /**
     * Validates a JWT token by comparing its {@code issuedAt} timestamp
     * with the user's last password modification date.
     *
     * <p>
     * If the token was issued before the user's last password update,
     * it is considered outdated and access should be denied.
     * </p>
     *
     * @param request the {@link TokenValidationRequest} containing the user's email
     *                and the token's issued timestamp
     * @return {@link ResponseEntity} containing:
     *         <ul>
     *             <li>HTTP 200 (OK) if the token is valid</li>
     *             <li>HTTP 403 (Forbidden) if the token is outdated</li>
     *         </ul>
     */
    @PostMapping("/validateTokenTimestamp")
    public ResponseEntity<String> validateTokenIssuedAt(@RequestBody TokenValidationRequest request) {
        return tokenValidationService.validateToken(request);
    }
}
