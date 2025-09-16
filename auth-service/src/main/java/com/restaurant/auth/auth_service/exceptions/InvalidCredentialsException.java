package com.restaurant.auth.auth_service.exceptions;

/**
 * Exception thrown when authentication fails due to invalid credentials,
 * such as an incorrect email or password.
 */
public class InvalidCredentialsException extends RuntimeException {

    /**
     * Creates a new InvalidCredentialsException with the given error message.
     *
     * @param message the detail message describing the authentication failure
     */
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
