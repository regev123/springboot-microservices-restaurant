package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.*;
import com.restaurant.auth.auth_service.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that handles authentication-related operations.
 *
 * <p>
 * Provides endpoints for:
 * <ul>
 *     <li>User login</li>
 *     <li>Password change</li>
 *     <li>Retrieving user details</li>
 * </ul>
 * </p>
 *
 * <p><b>Access Control:</b> Endpoints are publicly accessible unless otherwise secured via JWT.</p>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication endpoints for user login, password management, and user details")
public class AuthController {

    private final AuthService authService;

    // ---------------------------------------------------------------------
    // Endpoint: User Login
    // ---------------------------------------------------------------------

    /**
     * Authenticates a user using email and password credentials.
     *
     * <p>On successful authentication, returns a JWT token and user details that can be used for subsequent requests and to display user information.</p>
     *
     * @param request the login request containing user credentials (validated)
     * @return {@link ResponseEntity} containing an {@link AuthResponse} with a JWT token and user details
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token with user details")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(authResponse);
    }

    // ---------------------------------------------------------------------
    // Endpoint: Change Password
    // ---------------------------------------------------------------------

    /**
     * Changes the user's password.
     *
     * <p>Requires a valid combination of email, old password, and new password.</p>
     *
     * @param request the request body containing email, old password, and new password (validated)
     * @return {@link ResponseEntity} with HTTP 204 (No Content) upon successful password change
     */
    @PostMapping("/changePassword")
    @Operation(summary = "Change password", description = "Changes the user's password. Requires email, old password, and new password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(
                request.getEmail(),
                request.getOldPassword(),
                request.getNewPassword()
        );
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get User Details
    // ---------------------------------------------------------------------

    /**
     * Retrieves details of the authenticated user.
     *
     * <p>The user's email is extracted from the token and provided via the <code>X-User-Email</code> header.</p>
     *
     * @param userEmail the user's email address extracted from the JWT token
     * @return {@link ResponseEntity} containing the user's profile information as a {@link UserResponse}
     */
    @GetMapping("/user")
    @Operation(summary = "Get user details", description = "Retrieves details of the authenticated user. Requires JWT token in Authorization header")
    public ResponseEntity<UserResponse> getUser(@RequestHeader("X-User-Email") String userEmail) {
        UserResponse userResponse = authService.getUserByEmail(userEmail);
        return ResponseEntity.ok(userResponse);
    }
}
