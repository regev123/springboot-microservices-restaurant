package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.TokenValidationRequest;
import com.restaurant.auth.auth_service.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Service for validating tokens against a user's last password change date.
 */
@Service
@RequiredArgsConstructor
public class TokenValidationService {

    private final UserLookupService userLookupService;

    /**
     * Checks if a token is still valid based on when it was issued.
     * If the token was issued before the user's last password change,
     * it is considered invalid.
     *
     * @param request contains the user's email and the token's issued-at timestamp
     * @return 200 OK if valid, 403 FORBIDDEN if outdated
     */
    public ResponseEntity<String> isTokenValid(TokenValidationRequest request) {
        UserEntity user = userLookupService.getUserByEmail(request.getEmail());

        // Token is invalid if issued before the last password change
        if (request.getIssuedAt().isBefore(user.getPasswordModifiedDate())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Token is outdated due to password change");
        }

        return ResponseEntity.ok("Token is valid");
    }
}
