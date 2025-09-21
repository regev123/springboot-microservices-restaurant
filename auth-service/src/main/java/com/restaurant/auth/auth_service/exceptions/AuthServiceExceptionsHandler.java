package com.restaurant.auth.auth_service.exceptions;

import com.restaurant.common.exception.AccessDeniedHandler;
import com.restaurant.common.exception.GlobalExceptionHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Global exception handler for managing application-wide exceptions
 * and returning meaningful, standardized error responses to clients.
 *
 * <p>This class ensures that common validation, authentication,
 * and authorization errors are handled consistently across
 * the entire application.</p>
 */
@RestControllerAdvice
@Slf4j
public class AuthServiceExceptionsHandler extends GlobalExceptionHandler {
    /**
     * Handles authentication failures due to invalid credentials.
     *
     * <p>This method is invoked when a user provides incorrect login
     * credentials such as email or password.</p>
     *
     * @param ex the {@link InvalidCredentialsException} instance
     * @return a {@link ResponseEntity} with an error message and HTTP 401 Unauthorized status
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage());
    }

    /**
     * Handles authorization failures when a user attempts to access
     * a resource or perform an action they are not permitted to.
     *
     * <p>Typically corresponds to an HTTP 403 Forbidden response.</p>
     *
     * @param ex the {@link AccessDeniedHandler} instance
     * @return a {@link ResponseEntity} with an error message and HTTP 403 Forbidden status
     */


    /**
     * Handles business logic errors such as invalid requests
     * or duplicate entity creation attempts.
     *
     * <p>Typically thrown when business rules are violated, such as
     * attempting to register a user with an already registered email.</p>
     *
     * @param ex the {@link UserAlreadyExistsException} instance
     * @return a {@link ResponseEntity} with an error message and HTTP 400 Bad Request status
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage());
    }
}
