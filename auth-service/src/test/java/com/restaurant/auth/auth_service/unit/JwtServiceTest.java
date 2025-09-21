package com.restaurant.auth.auth_service.unit;

import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.common.exception.UserNotFoundException;
import com.restaurant.auth.auth_service.service.JwtService;
import com.restaurant.auth.auth_service.service.UserLookupService;
import com.restaurant.auth.auth_service.util.JwtProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link JwtService}.
 *
 * <p>This class verifies the behavior of the JWT token generation logic,
 * ensuring it correctly interacts with its dependencies:
 * {@link UserLookupService} and {@link JwtProperties}.</p>
 *
 * <p>Tests cover both successful token generation and failure scenarios.</p>
 */
class JwtServiceTest {

    // ===========================
    // Mocked Dependencies
    // ===========================
    @Mock
    private JwtProperties jwtProperties; // Mocked JWT configuration (secret, expiration, etc.)

    @Mock
    private UserLookupService userLookupService; // Mocked service for user retrieval

    @InjectMocks
    private JwtService jwtService; // Class under test

    // ===========================
    // Test Constants
    // ===========================
    private static final String SECRET_KEY = "ThisIsASecretKeyForJwtToken1234567890"; // Must be at least 32 chars
    private static final long EXPIRATION_TIME = 3_600_000; // 1 hour in milliseconds

    private UserDetails mockUserDetails;
    private UserEntity mockUserEntity;

    // ===========================
    // Setup
    // ===========================

    /**
     * Initializes mock objects and common test data before each test.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Configure mocked JWT properties
        when(jwtProperties.getSecret()).thenReturn(SECRET_KEY);
        when(jwtProperties.getExpiration()).thenReturn(EXPIRATION_TIME);

        // Create a mock Spring Security UserDetails object
        mockUserDetails = User.builder()
                .username("testuser@example.com")
                .password("password")
                .roles("USER")
                .build();

        // Create a mock UserEntity representing a database user
        mockUserEntity = new UserEntity();
        mockUserEntity.setId(1L);
        mockUserEntity.setEmail("testuser@example.com");
        mockUserEntity.setRole(Role.USER);
    }

    // ===========================
    // Tests
    // ===========================

    /**
     * Verifies that a valid JWT token is generated when the user exists in the database.
     */
    @Test
    @DisplayName("generateToken - Should generate a valid JWT token for an existing user")
    void testGenerateTokenSuccess() {
        // Given
        when(userLookupService.getUserByEmail("testuser@example.com"))
                .thenReturn(mockUserEntity);

        // When
        String token = jwtService.generateToken(mockUserDetails);

        // Then
        assertNotNull(token, "Token should not be null");
        assertFalse(token.isEmpty(), "Token should not be empty");
        verify(userLookupService, times(1)).getUserByEmail("testuser@example.com");
    }

    /**
     * Verifies that an exception is thrown when trying to generate a token
     * for a user that does not exist in the database.
     */
    @Test
    @DisplayName("generateToken - Should throw exception when user is not found")
    void testGenerateTokenUserNotFound() {
        // Given
        when(userLookupService.getUserByEmail("testuser@example.com"))
                .thenThrow(new UserNotFoundException("User not found"));

        // When & Then
        UserNotFoundException exception = assertThrows(
                UserNotFoundException.class,
                () -> jwtService.generateToken(mockUserDetails),
                "Expected generateToken() to throw, but it didn't"
        );

        assertEquals("User not found", exception.getMessage());
        verify(userLookupService, times(1)).getUserByEmail("testuser@example.com");
    }
}
