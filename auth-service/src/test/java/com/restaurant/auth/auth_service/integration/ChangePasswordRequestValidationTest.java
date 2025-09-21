package com.restaurant.auth.auth_service.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.auth.auth_service.dto.ChangePasswordRequest;
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
 * Integration tests for validating the Change Password API endpoint.
 *
 * <p>
 * This suite ensures that the API behaves correctly by validating:
 * <ul>
 *     <li>Successful password changes with valid input.</li>
 *     <li>Validation errors for missing or malformed fields.</li>
 *     <li>Error handling for invalid old passwords or non-existent users.</li>
 * </ul>
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // Disable Spring Security filters for isolated testing
class ChangePasswordRequestValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Test constants
    private static final String CHANGE_PASSWORD_PATH = "/auth/change-password";
    private static final String TEST_EMAIL = "user@restaurant.com";
    private static final String TEST_OLD_PASSWORD = "OldPass@123";
    private static final String TEST_NEW_PASSWORD = "NewPass@123";

    /**
     * Prepares a fresh test database before each test by inserting
     * a single user with a known email and password.
     */
    @BeforeEach
    void setUp() {
        userRepository.deleteAll(); // Clean the database before each test

        UserEntity user = new UserEntity();
        user.setEmail(TEST_EMAIL);
        user.setPassword(passwordEncoder.encode(TEST_OLD_PASSWORD));
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPhoneNumber("0501234567");

        userRepository.save(user);
    }

    // ==================================================
    // SUCCESS CASE
    // ==================================================

    @Test
    @DisplayName("Change Password API - Success with valid data")
    void changePasswordSuccess() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                TEST_EMAIL,
                TEST_OLD_PASSWORD,
                TEST_NEW_PASSWORD
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists()); // Ensure token is returned after successful change
    }

    // ==================================================
    // VALIDATION ERRORS
    // ==================================================

    @Test
    @DisplayName("Change Password API - Missing email")
    void changePasswordMissingEmail() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                "",
                TEST_OLD_PASSWORD,
                TEST_NEW_PASSWORD
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email is required"));
    }

    @Test
    @DisplayName("Change Password API - Invalid email format")
    void changePasswordInvalidEmail() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                "invalid-email",
                TEST_OLD_PASSWORD,
                TEST_NEW_PASSWORD
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email should be valid"));
    }

    @Test
    @DisplayName("Change Password API - Missing old password")
    void changePasswordMissingOldPassword() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                TEST_EMAIL,
                "",
                TEST_NEW_PASSWORD
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.oldPassword").value("Password is required"));
    }

    @Test
    @DisplayName("Change Password API - Weak old password format")
    void changePasswordWeakOldPassword() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                TEST_EMAIL,
                "weakpass",
                TEST_NEW_PASSWORD
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.oldPassword").value(
                        "Password must be at least 8 characters long and include 1 uppercase letter, " +
                                "1 lowercase letter, 1 number, and 1 special character"
                ));
    }

    @Test
    @DisplayName("Change Password API - Missing new password")
    void changePasswordMissingNewPassword() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                TEST_EMAIL,
                TEST_OLD_PASSWORD,
                ""
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.newPassword").value("Password is required"));
    }

    @Test
    @DisplayName("Change Password API - Weak new password format")
    void changePasswordWeakNewPassword() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                TEST_EMAIL,
                TEST_OLD_PASSWORD,
                "weakpass"
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.newPassword").value(
                        "Password must be at least 8 characters long and include 1 uppercase letter, " +
                                "1 lowercase letter, 1 number, and 1 special character"
                ));
    }

    // ==================================================
    // FAILURE CASES - INVALID OLD PASSWORD OR EMAIL
    // ==================================================

    @Test
    @DisplayName("Change Password API - Incorrect old password")
    void changePasswordIncorrectOldPassword() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                TEST_EMAIL,
                "WrongOld@123",
                TEST_NEW_PASSWORD
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email or password is incorrect"));
    }

    @Test
    @DisplayName("Change Password API - Non-existent email should return custom error")
    void changePasswordWithNonExistentEmail() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest(
                "nonexistent@restaurant.com",
                TEST_OLD_PASSWORD,
                TEST_NEW_PASSWORD
        );

        mockMvc.perform(post(CHANGE_PASSWORD_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email or password is incorrect"));
    }
}
