package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.*;
import com.restaurant.auth.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing authentication and user-related operations.
 *
 * <p>
 * Provides endpoints for user registration, login, password change,
 * and retrieving user details using a token.
 * </p>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Registers a new user.
     *
     * @param request the registration details (validated)
     * @return an authentication response containing a JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param request the login credentials (validated)
     * @return an authentication response containing a JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("User attempting to login with email: {}", request.getEmail());
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Changes the user's password and returns a new JWT token.
     *
     * @param request contains the email, old password, and new password (validated)
     * @return an authentication response containing a new JWT token
     */
    @PostMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        log.info("Password change requested for email: {}", request.getEmail());
        return ResponseEntity.ok(authService.changePassword(request));
    }

    /**
     * Retrieves the currently authenticated user's details using the token email header.
     *
     * @param userEmail the user's email extracted from the JWT token (provided in request header)
     * @return the user's basic information
     */
    @GetMapping("/user")
    public ResponseEntity<UserResponse> getUser(@RequestHeader("X-User-Email") String userEmail) {
        log.info("Fetching user details for email: {}", userEmail);
        return ResponseEntity.ok(authService.getUserByEmail(userEmail));
    }
}
