package com.restaurant.common.security.authorization;

import com.restaurant.common.exception.AccessDeniedHandler;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

/**
 * Service for role-based authorization validation across all microservices.
 *
 * <p>This service provides centralized role validation logic that can be used
 * in different contexts (AOP, direct service calls, etc.). It follows the
 * Single Responsibility Principle by focusing solely on authorization logic.</p>
 *
 * <p>Example usage:</p>
 * <pre>
 *     roleBasedAuthorizationService.validateRole(userRole, "ADMIN");
 *     roleBasedAuthorizationService.validateRole(userRole, "ADMIN", "SUPERVISOR");
 * </pre>
 */
@Service
public class RoleBasedAuthorizationService {

    /**
     * Validates that the user has at least one of the required roles.
     * <p>
     * This method will:
     * <ul>
     *   <li>Throw {@code 401 Unauthorized} if the role header is missing or empty.</li>
     *   <li>Throw {@code 403 Forbidden} if the role is present but does not match any required role.</li>
     * </ul>
     *
     * @param userRole      The role extracted from the request header (e.g., {@code X-User-Role}).
     * @param requiredRoles One or more roles required to access the resource.
     *                      Example: {@code "ADMIN"} or {@code "ADMIN", "SUPERVISOR"}.
     * @throws ResponseStatusException if the user does not have permission to access the resource.
     */
    public void validateRole(String userRole, String... requiredRoles) {
        validateRoleHeader(userRole);
        validateUserAuthorization(userRole, Arrays.asList(requiredRoles));
    }

    /**
     * Validates that the role header is present and not empty.
     *
     * @param userRole the role extracted from the request header.
     * @throws ResponseStatusException if the header is missing or blank.
     */
    private void validateRoleHeader(String userRole) {
        if (userRole == null || userRole.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Missing or empty role header"
            );
        }
    }

    /**
     * Checks whether the provided user role is included in the list of allowed roles.
     *
     * @param userRole     the role of the current user.
     * @param allowedRoles list of roles permitted to perform the action.
     * @throws ResponseStatusException if the user's role is not authorized.
     */
    private void validateUserAuthorization(String userRole, List<String> allowedRoles) {
        boolean isAuthorized = allowedRoles.stream()
                .anyMatch(role -> role.equalsIgnoreCase(userRole));

        if (!isAuthorized) {
            throw new AccessDeniedHandler("Access denied: Requires one of the roles: "
                    + String.join(", ", allowedRoles)
            );
        }
    }
}
