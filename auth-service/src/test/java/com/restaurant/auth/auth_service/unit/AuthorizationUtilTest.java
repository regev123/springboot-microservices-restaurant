package com.restaurant.auth.auth_service.unit;

import com.restaurant.common.exception.AccessDeniedHandler;
import com.restaurant.auth.auth_service.util.AuthorizationUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

/**
 * Unit tests for {@link AuthorizationUtil}.
 *
 * <p>
 * This test class validates the behavior of role-based authorization checks.
 * It ensures that users with correct roles are granted access and users
 * with missing or invalid roles are denied access appropriately.
 * </p>
 *
 * <p>Scenarios covered:</p>
 * <ul>
 *     <li>Valid role matches (exact or among multiple roles).</li>
 *     <li>Case-insensitive role comparison.</li>
 *     <li>Unauthorized (401) when role header is missing or blank.</li>
 *     <li>Forbidden (403) when user role is invalid or no allowed roles are provided.</li>
 * </ul>
 */
class AuthorizationUtilTest {

    private final AuthorizationUtil authorizationUtil = new AuthorizationUtil();

    // ==========================================
    // SUCCESS CASES
    // ==========================================

    @Test
    @DisplayName("checkRole - Passes when user has the exact required role")
    void checkRoleSuccessWithExactRole() {
        assertDoesNotThrow(() ->
                authorizationUtil.checkRole("ADMIN", "ADMIN")
        );
    }

    @Test
    @DisplayName("checkRole - Passes when user has one of multiple allowed roles")
    void checkRoleSuccessWithMultipleAllowedRoles() {
        assertDoesNotThrow(() ->
                authorizationUtil.checkRole("SUPERVISOR", "ADMIN", "SUPERVISOR")
        );
    }

    @Test
    @DisplayName("checkRole - Passes when role comparison is case-insensitive")
    void checkRoleCaseInsensitive() {
        assertDoesNotThrow(() ->
                authorizationUtil.checkRole("admin", "ADMIN", "SUPERVISOR")
        );
    }

    // ==========================================
    // FAILURE CASES
    // ==========================================

    @Test
    @DisplayName("checkRole - Throws 401 when role header is missing (null)")
    void checkRoleMissingRoleHeader() {
        assertThatThrownBy(() ->
                authorizationUtil.checkRole(null, "ADMIN")
        )
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Missing or empty role header");
    }

    @Test
    @DisplayName("checkRole - Throws 401 when role header is blank")
    void checkRoleBlankRoleHeader() {
        assertThatThrownBy(() ->
                authorizationUtil.checkRole("  ", "ADMIN")
        )
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Missing or empty role header");
    }

    @Test
    @DisplayName("checkRole - Throws 403 when user does not have any of the required roles")
    void checkRoleForbiddenForInvalidRole() {
        assertThatThrownBy(() ->
                authorizationUtil.checkRole("USER", "ADMIN", "SUPERVISOR")
        )
                .isInstanceOf(AccessDeniedHandler.class)
                .hasMessageContaining("Access denied: Requires one of the roles: ADMIN, SUPERVISOR");
    }

    @Test
    @DisplayName("checkRole - Throws 403 when no allowed roles are provided")
    void checkRoleForbiddenWhenNoRolesProvided() {
        assertThatThrownBy(() ->
                authorizationUtil.checkRole("USER") // No allowed roles passed
        )
                .isInstanceOf(AccessDeniedHandler.class)
                .hasMessageContaining("Access denied: Requires one of the roles:");
    }
}
