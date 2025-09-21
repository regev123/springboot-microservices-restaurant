package com.restaurant.common.exception;

/**
 * Custom exception thrown when a user attempts to access
 * a resource or perform an action they are not authorized for.
 *
 * <p>
 * This exception represents an HTTP {@code 403 Forbidden} error
 * and is typically used when role-based access control (RBAC)
 * checks fail in the application.
 * </p>
 *
 * <p>
 * Example usage:
 * <pre>
 *     throw new AccessDeniedHandler("Access denied: ADMIN role required");
 * </pre>
 * </p>
 */
public class AccessDeniedHandler extends RuntimeException {

    /**
     * Constructs a new {@link AccessDeniedHandler} with a specified error message.
     *
     * @param message a descriptive message explaining why access was denied.
     */
    public AccessDeniedHandler(String message) {
        super(message);
    }
}
