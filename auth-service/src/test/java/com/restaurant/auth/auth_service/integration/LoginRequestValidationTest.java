package com.restaurant.auth.auth_service.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.auth.auth_service.dto.LoginRequest;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for validating the Login API endpoint.
 *
 * <p>
 * This suite verifies that the login endpoint correctly validates
 * incoming requests, handles authentication failures, and returns
 * JWT tokens for successful logins.
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for test isolation
class LoginRequestValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String LOGIN_PATH = "/auth/login";
    private static final String TEST_EMAIL = "admin@restaurant.com";
    private static final String TEST_PASSWORD = "Admin@123";

    /**
     * Prepares the database before each test by inserting a test user
     * with known credentials for authentication scenarios.
     */
    @BeforeEach
    void setUp() {
        userRepository.deleteAll(); // Ensure a clean state before each test

        UserEntity user = new UserEntity();
        user.setEmail(TEST_EMAIL);
        user.setPassword(passwordEncoder.encode(TEST_PASSWORD));

        userRepository.save(user);
    }

    // ==================================================
    // SUCCESS CASE
    // ==================================================

    @Test
    @DisplayName("Login API - Success with valid credentials")
    void loginWithValidCredentials() throws Exception {
        LoginRequest request = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);

        mockMvc.perform(post(LOGIN_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists()); // Token must be returned on successful login
    }

    // ==================================================
    // FAILURE CASES - INVALID CREDENTIALS
    // ==================================================

    @Test
    @DisplayName("Login API - Invalid email should return custom error response")
    void loginWithInvalidEmail() throws Exception {
        LoginRequest request = new LoginRequest("wrong.email@test.com", TEST_PASSWORD);

        mockMvc.perform(post(LOGIN_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email or password is incorrect"));
    }

    @Test
    @DisplayName("Login API - Invalid password should return custom error response")
    void loginWithInvalidPassword() throws Exception {
        LoginRequest request = new LoginRequest(TEST_EMAIL, "WrongPass@123");

        mockMvc.perform(post(LOGIN_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email or password is incorrect"));
    }

    // ==================================================
    // FAILURE CASES - VALIDATION ERRORS
    // ==================================================

    @Test
    @DisplayName("Login API - Missing email should trigger validation error")
    void loginMissingEmail() throws Exception {
        LoginRequest request = new LoginRequest("", "Valid@123");

        mockMvc.perform(post(LOGIN_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email is required"));
    }

    @Test
    @DisplayName("Login API - Invalid email format should trigger validation error")
    void loginInvalidEmailFormat() throws Exception {
        LoginRequest request = new LoginRequest("invalid-email", "Valid@123");

        mockMvc.perform(post(LOGIN_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email should be valid"));
    }

    @Test
    @DisplayName("Login API - Missing password should trigger validation error")
    void loginMissingPassword() throws Exception {
        LoginRequest request = new LoginRequest("valid.email@test.com", "");

        mockMvc.perform(post(LOGIN_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password is required"));
    }

    @Test
    @DisplayName("Login API - Weak password should trigger validation error")
    void loginWeakPassword() throws Exception {
        // Password missing special character and uppercase letter
        LoginRequest request = new LoginRequest("valid.email@test.com", "Weakpass1");

        mockMvc.perform(post(LOGIN_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value(
                        "Password must be at least 8 characters long and include 1 uppercase letter, " +
                                "1 lowercase letter, 1 number, and 1 special character"
                ));
    }
}
