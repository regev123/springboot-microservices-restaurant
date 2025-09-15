package com.restaurant.auth.auth_service;

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

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class LoginRequestValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String TEST_EMAIL = "admin@restaurant.com";
    private static final String TEST_PASSWORD = "Admin@123";

    /**
     * Insert a user before each test to ensure a valid login exists
     */
    @BeforeEach
    void setUp() {
        userRepository.deleteAll(); // Clean DB to avoid duplicates

        UserEntity user = new UserEntity();
        user.setEmail(TEST_EMAIL);
        user.setPassword(passwordEncoder.encode(TEST_PASSWORD));

        userRepository.save(user);
    }

    // ---------- SUCCESS LOGIN ----------

    @Test
    @DisplayName("Login API - Success with valid credentials")
    void loginWithValidCredentials() throws Exception {
        LoginRequest request = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists()); // Ensure token is returned
    }

    // ---------- CREDENTIALS FAILURES ----------

    @Test
    @DisplayName("Login API - Invalid email should return custom exception")
    void loginWithInvalidEmail() throws Exception {
        LoginRequest request = new LoginRequest("wrong.email@test.com", TEST_PASSWORD);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Email or password is incorrect"));
    }

    @Test
    @DisplayName("Login API - Invalid password should return custom exception")
    void loginWithInvalidPassword() throws Exception {
        LoginRequest request = new LoginRequest(TEST_EMAIL, "WrongPass@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Email or password is incorrect"));
    }

    // ---------- VALIDATION FAILURES ----------

    @Test
    @DisplayName("Login API - Missing email")
    void loginMissingEmail() throws Exception {
        LoginRequest request = new LoginRequest("", "Valid@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email is required"));
    }

    @Test
    @DisplayName("Login API - Invalid email format")
    void loginInvalidEmailFormat() throws Exception {
        LoginRequest request = new LoginRequest("invalid-email", "Valid@123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email should be valid"));
    }

    @Test
    @DisplayName("Login API - Missing password")
    void loginMissingPassword() throws Exception {
        LoginRequest request = new LoginRequest("valid.email@test.com", "");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password is required"));
    }

    @Test
    @DisplayName("Login API - Weak password (does not meet pattern requirements)")
    void loginWeakPassword() throws Exception {
        // Password missing special character
        LoginRequest request = new LoginRequest("valid.email@test.com", "Weakpass1");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value(
                        "Password must be at least 8 characters long and include 1 uppercase letter, " +
                                "1 lowercase letter, 1 number, and 1 special character"
                ));
    }
}
