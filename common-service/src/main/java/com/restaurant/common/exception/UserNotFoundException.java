package com.restaurant.common.exception;

/**
 * Custom exception thrown when a user is not found in the system.
 * This exception represents an HTTP {@code 404 Not Found} error.
 */
public class UserNotFoundException extends RuntimeException {
    
    /**
     * Constructs a new {@link UserNotFoundException} with a specified error message.
     *
     * @param message a descriptive message explaining which user was not found.
     */
    public UserNotFoundException(String message) {
        super(message);
    }
}
