package com.restaurant.apiGateway.api_gateway_service.exception;

/**
 * Exception thrown when JWT token validation fails due to various reasons.
 *
 * <p>
 * This exception is thrown when token validation encounters errors such as:
 * <ul>
 *   <li>Invalid token format</li>
 *   <li>Corrupted token data</li>
 *   <li>Network issues during validation</li>
 *   <li>Authentication service unavailability</li>
 * </ul>
 * </p>
 *
 * <p><b>Note:</b> This is a generic validation exception that covers
 * various token validation failure scenarios.</p>
 */
public class TokenValidationException extends RuntimeException {

    /**
     * Creates a new TokenValidationException with the given error message.
     *
     * @param message the detail message explaining the validation failure
     */
    public TokenValidationException(String message) {
        super(message);
    }
}
