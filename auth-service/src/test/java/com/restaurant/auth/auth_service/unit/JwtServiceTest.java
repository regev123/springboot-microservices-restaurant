package com.restaurant.auth.auth_service.unit;

import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
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
 * <p>These tests focus on verifying token generation logic and ensuring that
 * dependencies such as {@link UserLookupService} and {@link JwtProperties}
 * are correctly used within the service.</p>
 */
class JwtServiceTest {

    @Mock
    private JwtProperties jwtProperties; // Mocked configuration for JWT

    @Mock
    private UserLookupService userLookupService; // Mocked service to fetch user details

    @InjectMocks
    private JwtService jwtService; // Class under test

    // Test constants
    private static final String SECRET_KEY = "ThisIsASecretKeyForJwtToken1234567890"; // Must be at least 32 chars
    private static final long EXPIRATION_TIME = 3600000; // 1 hour

    private UserDetails mockUserDetails;
    private UserEntity mockUserEntity;

    /**
     * Initializes mocks and sets up common test data before each test case.
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock JWT properties behavior
        when(jwtProperties.getSecret()).thenReturn(SECRET_KEY);
        when(jwtProperties.getExpiration()).thenReturn(EXPIRATION_TIME);

        // Create a mock Spring Security user (UserDetails)
        mockUserDetails = User.builder()
                .username("testuser@example.com")
                .password("password")
                .roles("USER")
                .build();

        // Create a mock UserEntity that represents a database user
        mockUserEntity = new UserEntity();
        mockUserEntity.setId(1L);
        mockUserEntity.setEmail("testuser@example.com");
        mockUserEntity.setRole(Role.USER);
    }

    /**
     * Verifies that a valid JWT token is generated when a valid user exists.
     */
    @Test
    @DisplayName("generateToken - Should generate a valid JWT token")
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
     * Verifies that an exception is thrown when attempting to generate
     * a token for a non-existent user.
     */
    @Test
    @DisplayName("generateToken - Should throw exception when user not found")
    void testGenerateTokenUserNotFound() {
        // Given
        when(userLookupService.getUserByEmail("testuser@example.com"))
                .thenThrow(new IllegalArgumentException("User not found"));

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> jwtService.generateToken(mockUserDetails)
        );

        assertEquals("User not found", exception.getMessage());
        verify(userLookupService, times(1)).getUserByEmail("testuser@example.com");
    }
}
