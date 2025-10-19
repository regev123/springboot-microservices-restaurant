package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.TokenValidationRequest;
import com.restaurant.auth.auth_service.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Service that validates authentication tokens against the user's account state.
 *
 * <p>
 * A token is considered invalid if it was issued before the user's
 * last password modification timestamp. This ensures that password changes
 * immediately invalidate all previously issued tokens.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class TokenValidationService {

    // ==================== CONSTANTS ====================
    // Response Messages
    private static final String TOKEN_OUTDATED_MSG = "Token is outdated due to password change";
    private static final String TOKEN_VALID_MSG = "Token is valid";
    
    // ==================== DEPENDENCIES ====================
    private final UserLookupService userLookupService;

    // ---------------------------------------------------------------------
    // Token Validation
    // ---------------------------------------------------------------------

    /**
     * Validates whether the provided JWT token is still valid.
     *
     * <p>
     * If the token was issued before the user's last password change,
     * it is considered outdated and should be rejected.
     * </p>
     *
     * @param request the {@link TokenValidationRequest} containing the user's email
     *                and the token's {@code issuedAt} timestamp
     * @return {@link ResponseEntity} containing:
     *         <ul>
     *             <li>HTTP 200 (OK) if the token is valid</li>
     *             <li>HTTP 403 (Forbidden) if the token is outdated</li>
     *         </ul>
     */
    public ResponseEntity<String> validateToken(TokenValidationRequest request) {
        UserEntity user = userLookupService.getUserByEmail(request.getEmail());

        if (isTokenOutdated(request, user)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(TOKEN_OUTDATED_MSG);
        }

        return ResponseEntity.ok(TOKEN_VALID_MSG);
    }

    // ---------------------------------------------------------------------
    // Helper Methods
    // ---------------------------------------------------------------------

    /**
     * Determines whether the token was issued before the user's last password change.
     *
     * @param request the {@link TokenValidationRequest} containing the token's {@code issuedAt} time
     * @param user    the {@link UserEntity} whose token validity is being checked
     * @return {@code true} if the token is outdated; {@code false} otherwise
     */
    private boolean isTokenOutdated(TokenValidationRequest request, UserEntity user) {
        return request.getIssuedAt().isBefore(user.getPasswordModifiedDate());
    }
}
