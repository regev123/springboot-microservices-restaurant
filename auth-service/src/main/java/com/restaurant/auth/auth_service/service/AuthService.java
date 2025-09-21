package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.*;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.exceptions.InvalidCredentialsException;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Service responsible for managing authentication-related operations,
 * such as user registration, login, password changes, and user lookups.
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



    /**
     * Authenticates a user and returns a JWT token upon successful login.
     *
     * @param request login request containing email and password
     * @return authentication response with JWT token
     */
    public AuthResponse login(LoginRequest request) {
        authenticate(request.getEmail(), request.getPassword());

        UserEntity user = userLookupService.getUserByEmail(request.getEmail());
        return buildAuthResponse(user);
    }

    /**
     * Changes the user's password and issues a new JWT token.
     *
     * @param request password change request
     * @return authentication response with new JWT token
     */
    public String changePassword(ChangePasswordRequest request) {
        authenticate(request.getEmail(), request.getOldPassword());
        UserEntity user = userLookupService.getUserByEmail(request.getEmail());
        updatePassword(user, request.getNewPassword());
        return "Password changed successfully";
    }

    /**
     * Retrieves user details by email.
     *
     * @param email user email
     * @return basic user information
     */
    public UserResponse getUserByEmail(String email) {
        UserEntity user = userLookupService.getUserByEmail(email);
        return mapToUserResponse(user);
    }

    /**
     * Authenticates the provided email and password.
     *
     * @param email user email
     * @param password user password
     */
    private void authenticate(String email, String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Email or password is incorrect");
        }
    }

    /**
     * Updates the user's password and refreshes the password modification timestamp.
     *
     * @param user the user whose password will be updated
     * @param newPassword the new password
     */
    private void updatePassword(UserEntity user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordModifiedDate(Instant.now());
        userRepository.saveAndFlush(user);
    }

    /**
     * Generates a JWT token for the user and wraps it in an AuthResponse.
     *
     * @param user the user to generate a token for
     * @return an AuthResponse containing the token
     */
    private AuthResponse buildAuthResponse(UserEntity user) {
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    /**
     * Maps a UserEntity to a simplified user response object.
     *
     * @param user the user entity
     * @return a basic user response
     */
    private UserResponse mapToUserResponse(UserEntity user) {
        return new UserResponse(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
}
