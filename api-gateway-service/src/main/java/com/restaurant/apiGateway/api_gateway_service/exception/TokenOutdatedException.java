package com.restaurant.apiGateway.api_gateway_service.exception;

/**
 * Exception thrown when a JWT token is considered outdated.
 *
 * <p>
 * This exception is typically thrown when a token was issued before the user's
 * last password modification timestamp, making it invalid for security reasons.
 * </p>
 *
 * <p><b>Security Note:</b> This ensures that password changes immediately
 * invalidate all previously issued tokens, maintaining security integrity.</p>
 */
public class TokenOutdatedException extends RuntimeException {

    /**
     * Creates a new TokenOutdatedException with the given error message.
     *
     * @param message the detail message explaining why the token is outdated
     */
    public TokenOutdatedException(String message) {
        super(message);
    }
}
