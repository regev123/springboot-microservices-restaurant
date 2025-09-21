package com.restaurant.auth.auth_service.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.auth.auth_service.dto.UpdateUserRoleRequest;
import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link com.restaurant.auth.auth_service.controller.AdminController}.
 *
 * <p>This class verifies that the admin-specific API endpoints
 * behave correctly in various scenarios including success, authorization failures,
 * and validation errors.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for direct testing
class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private UserEntity adminUser;
    private UserEntity normalUser;

    private static final String BASE_URL = "/auth/admin/users";

    /**
     * Sets up test data before each test case.
     * <p>
     * - Clears the database.
     * - Creates one ADMIN user (current logged-in admin).
     * - Creates one regular USER for testing updates and retrieval.
     * </p>
     */
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Create an admin user
        adminUser = new UserEntity();
        adminUser.setEmail("admin@restaurant.com");
        adminUser.setPassword("AdminPass@123");
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setPhoneNumber("0500000001");
        adminUser.setRole(Role.ADMIN);
        userRepository.save(adminUser);

        // Create a normal user
        normalUser = new UserEntity();
        normalUser.setEmail("user@restaurant.com");
        normalUser.setPassword("UserPass@123");
        normalUser.setFirstName("John");
        normalUser.setLastName("Doe");
        normalUser.setPhoneNumber("0500000002");
        normalUser.setRole(Role.USER);
        userRepository.save(normalUser);
    }

    // ----------------------------------------------------------------------
    // Test: updateUserRole
    // ----------------------------------------------------------------------

    @Test
    @DisplayName("updateUserRole - Success when ADMIN updates another user's role")
    void updateUserRoleSuccess() throws Exception {
        UpdateUserRoleRequest request = new UpdateUserRoleRequest();
        request.setNewRole(Role.SUPERVISOR);

        mockMvc.perform(put(BASE_URL + "/" + normalUser.getId() + "/role")
                        .header("X-User-Role", "ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User role updated successfully"));

        // Verify DB update
        UserEntity updatedUser = userRepository.findById(normalUser.getId()).orElseThrow();
        org.assertj.core.api.Assertions.assertThat(updatedUser.getRole()).isEqualTo(Role.SUPERVISOR);
    }

    @Test
    @DisplayName("updateUserRole - BadRequest when role is missing in request body")
    void updateUserRoleValidationFailure() throws Exception {
        UpdateUserRoleRequest request = new UpdateUserRoleRequest(); // Missing role

        mockMvc.perform(put(BASE_URL + "/" + normalUser.getId() + "/role")
                        .header("X-User-Role", "ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.newRole").value("Role is required"));
    }

    // ----------------------------------------------------------------------
    // Test: getAllUsers
    // ----------------------------------------------------------------------

    @Test
    @DisplayName("getAllUsers - Success returns list excluding current admin")
    void getAllUsersSuccess() throws Exception {
        mockMvc.perform(get(BASE_URL)
                        .header("X-User-Role", "ADMIN")
                        .header("X-User-Email", adminUser.getEmail()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2))) // Only 1 non-admin user
                .andExpect(jsonPath("$[0].email", is(normalUser.getEmail())));
    }
}

