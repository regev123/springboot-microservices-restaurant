package com.restaurant.auth.auth_service.exceptions;

import com.restaurant.common.exception.GlobalExceptionHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Centralized exception handler for authentication and authorization-related errors.
 *
 * <p>
 * This class extends {@link GlobalExceptionHandler} to provide standardized
 * error responses for exceptions specific to the authentication service.
 * </p>
 *
 * <p>
 * It ensures that exceptions such as invalid credentials, duplicate user registration,
 * or authentication failures are handled consistently across all controllers.
 * </p>
 */
@RestControllerAdvice
@Slf4j
public class AuthServiceExceptionsHandler extends GlobalExceptionHandler {

    // ---------------------------------------------------------------------
    // Invalid Credentials (Custom Application Exception)
    // ---------------------------------------------------------------------

    /**
     * Handles invalid login attempts caused by incorrect credentials.
     *
     * <p>
     * Triggered when a user attempts to log in with an incorrect email or password.
     * Returns an HTTP 401 (Unauthorized) status with a descriptive message.
     * </p>
     *
     * @param ex the {@link InvalidCredentialsException} thrown during authentication
     * @return a {@link ResponseEntity} containing the error message and status code
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage());
    }

    // ---------------------------------------------------------------------
    // Duplicate User Registration
    // ---------------------------------------------------------------------

    /**
     * Handles cases where a user attempts to register with an email that already exists.
     *
     * <p>
     * Returns an HTTP 409 (Conflict) response with a clear explanation of the issue.
     * </p>
     *
     * @param ex the {@link UserAlreadyExistsException} thrown when a duplicate email is detected
     * @return a {@link ResponseEntity} containing the error message and status code
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage());
    }

    // ---------------------------------------------------------------------
    // Spring Security Authentication Exception
    // ---------------------------------------------------------------------

    /**
     * Handles authentication errors thrown directly by Spring Security.
     *
     * <p>
     * Typically occurs when credentials are invalid or when access tokens fail validation.
     * Returns an HTTP 401 (Unauthorized) with a generic error message for security reasons.
     * </p>
     *
     * @param ex the {@link AuthenticationException} thrown by Spring Security
     * @return a {@link ResponseEntity} containing a safe, standardized error message
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleSpringAuthException(AuthenticationException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid email or password");
    }
}
