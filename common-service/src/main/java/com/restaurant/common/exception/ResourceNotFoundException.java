package com.restaurant.common.exception;

/**
 * Custom exception thrown when a requested resource is not found.
 * This exception represents an HTTP {@code 404 Not Found} error.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    /**
     * Constructs a new {@link ResourceNotFoundException} with a specified error message.
     *
     * @param message a descriptive message explaining what resource was not found.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
