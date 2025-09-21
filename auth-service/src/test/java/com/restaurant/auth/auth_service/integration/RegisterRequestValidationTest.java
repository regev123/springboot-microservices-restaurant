package com.restaurant.auth.auth_service.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.auth.auth_service.dto.RegisterRequest;
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
 * Integration tests for validating the Register API endpoint.
 *
 * <p>
 * This test suite ensures proper validation and business logic
 * for user registration requests, covering both successful and
 * failure scenarios for each field.
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for testing
class RegisterRequestValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String REGISTER_PATH = "/auth/register";

    /**
     * Clean up the database before each test to ensure isolation.
     */
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    // ==================================================
    // SUCCESS CASE
    // ==================================================

    @Test
    @DisplayName("Register API - Success with valid data")
    void registerSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "newuser@test.com",
                "Valid@123",
                "John",
                "Doe",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists()); // Ensure token is returned
    }

    // ==================================================
    // EMAIL VALIDATION
    // ==================================================

    @Test
    @DisplayName("Register API - Missing email")
    void registerMissingEmail() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "",
                "Valid@123",
                "John",
                "Doe",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email is required"));
    }

    @Test
    @DisplayName("Register API - Invalid email format")
    void registerInvalidEmailFormat() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "invalid-email",
                "Valid@123",
                "John",
                "Doe",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email should be valid"));
    }

    // ==================================================
    // PASSWORD VALIDATION
    // ==================================================

    @Test
    @DisplayName("Register API - Missing password")
    void registerMissingPassword() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "",
                "John",
                "Doe",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password is required"));
    }

    @Test
    @DisplayName("Register API - Weak password")
    void registerWeakPassword() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "weakpass1",
                "John",
                "Doe",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value(
                        "Password must be at least 8 characters long and include 1 uppercase letter, " +
                                "1 lowercase letter, 1 number, and 1 special character"
                ));
    }

    // ==================================================
    // FIRST NAME VALIDATION
    // ==================================================

    @Test
    @DisplayName("Register API - Missing first name")
    void registerMissingFirstName() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "Valid@123",
                "",
                "Doe",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.firstName").value("First name is required"));
    }

    @Test
    @DisplayName("Register API - Invalid first name (too short)")
    void registerInvalidFirstNameTooShort() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "Valid@123",
                "Jo",
                "Doe",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.firstName").value("First name must be only letters with 3-30 characters"));
    }

    // ==================================================
    // LAST NAME VALIDATION
    // ==================================================

    @Test
    @DisplayName("Register API - Missing last name")
    void registerMissingLastName() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "Valid@123",
                "John",
                "",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.lastName").value("Last name is required"));
    }

    @Test
    @DisplayName("Register API - Invalid last name (too short)")
    void registerInvalidLastNameTooShort() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "Valid@123",
                "John",
                "D",
                "0541234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.lastName").value("Last name must be only letters with 3-30 characters"));
    }

    // ==================================================
    // PHONE NUMBER VALIDATION
    // ==================================================

    @Test
    @DisplayName("Register API - Missing phone number")
    void registerMissingPhoneNumber() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "Valid@123",
                "John",
                "Doe",
                "",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.phoneNumber").value("Phone number is required"));
    }

    @Test
    @DisplayName("Register API - Invalid phone number (not starting with 05)")
    void registerInvalidPhoneNumberNotStartingWith05() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "Valid@123",
                "John",
                "Doe",
                "0641234567",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.phoneNumber").value("Phone number must start with 05 and be exactly 10 digits"));
    }

    @Test
    @DisplayName("Register API - Invalid phone number (less than 10 digits)")
    void registerInvalidPhoneNumberTooShort() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "user@test.com",
                "Valid@123",
                "John",
                "Doe",
                "05412345",
                "USER"
        );

        mockMvc.perform(post(REGISTER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.phoneNumber").value("Phone number must start with 05 and be exactly 10 digits"));
    }
}
