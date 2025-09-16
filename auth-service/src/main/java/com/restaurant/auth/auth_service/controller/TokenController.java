package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.TokenValidationRequest;
import com.restaurant.auth.auth_service.service.TokenValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling JWT token validation operations.
 *
 * <p>
 * This controller exposes an endpoint to validate whether a JWT token
 * is still valid based on its {@code issuedAt} timestamp compared to
 * the user's last password modification date.
 * </p>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class TokenController {

    private final TokenValidationService tokenValidationService;

    /**
     * Validates a JWT token by checking if the token's {@code issuedAt} timestamp
     * is after the user's last password change.
     *
     * <p>
     * If the token was issued before the last password update, it is considered
     * invalid and access will be denied.
     * </p>
     *
     * @param request contains the user's email and the token's issued timestamp
     * @return a {@link ResponseEntity} containing:
     *         <ul>
     *           <li>HTTP 200 (OK) if the token is valid</li>
     *           <li>HTTP 403 (Forbidden) if the token is outdated</li>
     *         </ul>
     */
    @PostMapping("/validate-token-timestamp")
    public ResponseEntity<String> validateTokenIssuedAt(@RequestBody TokenValidationRequest request) {
        return tokenValidationService.isTokenValid(request);
    }
}
