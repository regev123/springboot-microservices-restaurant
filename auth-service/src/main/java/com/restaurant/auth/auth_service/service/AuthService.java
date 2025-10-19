package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.*;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.mapper.UserMapper;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Service that manages user authentication and account security operations.
 *
 * <p>
 * Provides functionality for:
 * <ul>
 *     <li>User login</li>
 *     <li>Password changes</li>
 *     <li>User data retrieval</li>
 *     <li>JWT token generation</li>
 * </ul>
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserLookupService userLookupService;
    private final UserMapper userMapper;

    // ---------------------------------------------------------------------
    // Login
    // ---------------------------------------------------------------------

    /**
     * Authenticates a user and returns a JWT token upon successful login.
     *
     * @param email    the user's email address
     * @param password the user's password
     * @return {@link AuthResponse} containing the generated JWT token
     * @throws org.springframework.security.core.AuthenticationException if authentication fails
     */
    public AuthResponse login(String email, String password) {
        authenticate(email, password);
        UserEntity user = userLookupService.getUserByEmail(email);
        return buildAuthResponse(user);
    }

    // ---------------------------------------------------------------------
    // Change Password
    // ---------------------------------------------------------------------

    /**
     * Changes the user's password and updates the password modification timestamp.
     *
     * <p>Ensures the old password is valid before applying the new one.</p>
     *
     * @param email       the user's email address
     * @param oldPassword the user's current password (for verification)
     * @param newPassword the new password to be set
     * @throws org.springframework.security.core.AuthenticationException if the old password is invalid
     */
    public void changePassword(String email, String oldPassword, String newPassword) {
        authenticate(email, oldPassword);
        updatePassword(userLookupService.getUserByEmail(email), newPassword);
    }

    // ---------------------------------------------------------------------
    // Retrieve User Info
    // ---------------------------------------------------------------------

    /**
     * Retrieves basic user profile information by email.
     *
     * @param email the user's email address
     * @return {@link UserResponse} containing user profile details
     * @throws com.restaurant.common.exception.UserNotFoundException if no user exists for the given email
     */
    public UserResponse getUserByEmail(String email) {
        UserEntity user = userLookupService.getUserByEmail(email);
        return mapToUserResponse(user);
    }

    // ---------------------------------------------------------------------
    // Authentication Logic
    // ---------------------------------------------------------------------

    /**
     * Performs authentication using Spring Security’s {@link AuthenticationManager}.
     *
     * @param email    the user's email address
     * @param password the user's password
     * @throws org.springframework.security.core.AuthenticationException if authentication fails
     */
    private void authenticate(String email, String password) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
        authenticationManager.authenticate(authenticationToken);
    }

    // ---------------------------------------------------------------------
    // Update Password Logic
    // ---------------------------------------------------------------------

    /**
     * Updates the user's password and refreshes the password modification date.
     *
     * @param user        the {@link UserEntity} whose password is being updated
     * @param newPassword the new password to be encoded and saved
     */
    private void updatePassword(UserEntity user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordModifiedDate(Instant.now());
        userRepository.saveAndFlush(user);
    }

    // ---------------------------------------------------------------------
    // Token & Response Helpers
    // ---------------------------------------------------------------------

    /**
     * Generates a new JWT token for the user and wraps it in an {@link AuthResponse}.
     *
     * @param user the authenticated {@link UserEntity}
     * @return an {@link AuthResponse} containing the generated JWT token and user details
     */
    private AuthResponse buildAuthResponse(UserEntity user) {
        String token = jwtService.generateToken(user);
        UserDetailsDto userDetails = userMapper.toDto(user);
        return new AuthResponse(token, userDetails);
    }

    /**
     * Maps a {@link UserEntity} to a simplified {@link UserResponse}.
     *
     * @param user the user entity
     * @return a {@link UserResponse} containing basic user details
     */
    private UserResponse mapToUserResponse(UserEntity user) {
        return userMapper.toUserResponse(user);
    }
}
