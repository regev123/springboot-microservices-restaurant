package com.restaurant.auth.auth_service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.auth.auth_service.dto.ChangePasswordRequest;
import com.restaurant.auth.auth_service.dto.LoginRequest;
import com.restaurant.auth.auth_service.dto.RegisterRequest;
import com.restaurant.auth.auth_service.dto.UpdateUserRoleRequest;
import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;

    @Value("${app.admin.email}")    private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;

    private String adminToken;

    // ---------- helpers ----------

    private static String randomEmail(String prefix) {
        return prefix + "+" + UUID.randomUUID() + "@test.com";
    }

    private String extractToken(String responseBody) throws Exception {
        JsonNode node = objectMapper.readTree(responseBody);
        return node.get("token").asText();
    }

    private String registerAndGetToken(String email, String password,
                                       String firstName, String lastName, String phone) throws Exception {
        RegisterRequest req = new RegisterRequest(email, password, firstName, lastName, phone);
        String resp = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return extractToken(resp);
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest(email, password);
        String resp = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return extractToken(resp);
    }

    private void changePassword(String bearerToken, String email,
                                String oldPass, String newPass) throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest(email, oldPass, newPass);
        mockMvc.perform(post("/api/auth/changePassword")
                        .header("Authorization", "Bearer " + bearerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    private Long userIdByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow().getId();
    }

    // ---------- setup ----------

    @BeforeEach
    void setUp() throws Exception {
        // Ensure admin exists (initializer creates it) and get fresh token per test
        assertTrue(userRepository.findByEmail(adminEmail).isPresent(), "Admin must exist");
        adminToken = loginAndGetToken(adminEmail, adminPassword);
        assertNotNull(adminToken);
    }

    // ---------- tests ----------

    @Test
    void register_ShouldFailWithWeakPassword() throws Exception {
        RegisterRequest weak = new RegisterRequest(
                randomEmail("weak"), "weakpass", "John", "Doe", "0512345678");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(weak)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").exists());
    }

    @Test
    void register_ShouldFailIfEmailIsInvalid() throws Exception {
        RegisterRequest bad = new RegisterRequest(
                "invalid-email", "Password1!", "John", "Doe", "0512345678");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email should be valid"));
    }

    @Test
    void register_ShouldFailIfEmailAlreadyExists() throws Exception {
        String email = randomEmail("dup");
        RegisterRequest first = new RegisterRequest(email, "Password1!", "Jane", "Doe", "0598765432");
        RegisterRequest dup   = new RegisterRequest(email, "Password1!", "Jane", "Doe", "0598765432");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dup)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("A user with this email is already registered."));
    }

    @Test
    void register_ShouldReturnJwtToken() throws Exception {
        String email = randomEmail("integration");
        RegisterRequest req = new RegisterRequest(email, "Password1!", "Alice", "Smith", "0511122233");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void login_ShouldReturnJwtToken() throws Exception {
        String email = randomEmail("login");
        registerAndGetToken(email, "Password1!", "John", "Doe", "0512345678");

        LoginRequest loginReq = new LoginRequest(email, "Password1!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void login_ShouldFailWithInvalidCredentials() throws Exception {
        LoginRequest bad = new LoginRequest("wrong@test.com", "Invalid1!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void registerAndChangePasswordWithoutSeparateLogin() throws Exception {
        String email = randomEmail("instant");
        String token = registerAndGetToken(email, "Password1!", "John", "Doe", "0512345678");

        changePassword(token, email, "Password1!", "NewPassword2@");

        LoginRequest loginReq = new LoginRequest(email, "NewPassword2@");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void registerAndGetUserByToken_ShouldReturnUserDetails() throws Exception {
        String email = randomEmail("apitest");
        String token = registerAndGetToken(email, "Password1!", "Jane", "Doe", "0512345678");

        mockMvc.perform(get("/api/auth/getUserByToken")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.phoneNumber").value("0512345678"));
    }

    @Test
    void getUserByToken_ShouldFailWithOldTokenAfterPasswordChange() throws Exception {
        String email = randomEmail("oldtoken");
        String oldToken = registerAndGetToken(email, "Password1!", "Mark", "Doe", "0512345678");

        // ensure iat strictly < passwordModifiedDate in your service logic
        Thread.sleep(1000);

        changePassword(oldToken, email, "Password1!", "Password2@");

        mockMvc.perform(get("/api/auth/getUserByToken")
                        .header("Authorization", "Bearer " + oldToken))
                .andExpect(status().isForbidden()); // your filter returns 403 when token rejected
    }

    @Test
    void getUserByToken_ShouldWorkWithNewTokenAfterPasswordChange() throws Exception {
        String email = randomEmail("newtoken");
        String oldToken = registerAndGetToken(email, "Password1!", "Jane", "Doe", "0512345678");

        // change password -> capture new token from response
        ChangePasswordRequest req = new ChangePasswordRequest(email, "Password1!", "Password2@");
        String resp = mockMvc.perform(post("/api/auth/changePassword")
                        .header("Authorization", "Bearer " + oldToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn().getResponse().getContentAsString();

        String newToken = extractToken(resp);

        mockMvc.perform(get("/api/auth/getUserByToken")
                        .header("Authorization", "Bearer " + newToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    void adminShouldChangeUserRole() throws Exception {
        String email = randomEmail("employee");
        registerAndGetToken(email, "Password1!", "John", "Doe", "0512345678");
        Long userId = userIdByEmail(email);

        UpdateUserRoleRequest update = new UpdateUserRoleRequest();
        update.setNewRole(Role.SUPERVISOR);

        mockMvc.perform(put("/api/admin/users/" + userId + "/role")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("User role updated successfully")));

        UserEntity updated = userRepository.findByEmail(email).orElseThrow();
        assertEquals(Role.SUPERVISOR, updated.getRole());
    }

    @Test
    void nonAdminUser_ShouldNotBeAbleToChangeUserRole() throws Exception {
        String attackerEmail = randomEmail("employee2");
        String attackerToken = registerAndGetToken(attackerEmail, "Password1!", "Alice", "Smith", "0512345679");

        String victimEmail = randomEmail("targetuser");
        registerAndGetToken(victimEmail, "Password1!", "Bob", "Johnson", "0512345680");
        Long victimId = userIdByEmail(victimEmail);

        UpdateUserRoleRequest update = new UpdateUserRoleRequest();
        update.setNewRole(Role.SUPERVISOR);

        mockMvc.perform(put("/api/admin/users/{id}/role", victimId)
                        .header("Authorization", "Bearer " + attackerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminShouldGetAllUsers_ListIncludesNewlyRegistered() throws Exception {
        // Register a couple of regular users
        String email1 = randomEmail("listuser1");
        String email2 = randomEmail("listuser2");

        registerAndGetToken(email1, "Password1!", "John", "Doe", "0512345678");
        registerAndGetToken(email2, "Password1!", "Jane", "Smith", "0512345679");

        // Admin fetches all users (admin should be excluded by the API)
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                // includes the two newly registered users
                .andExpect(jsonPath("$..email", hasItems(email1, email2)))
                // does NOT include the admin who made the request
                .andExpect(jsonPath("$..email", not(hasItem(adminEmail))));
    }

    @Test
    void nonAdminUser_ShouldNotAccessUsersList() throws Exception {
        // Register a normal user and get their token
        String nonAdminEmail = randomEmail("plain");
        String nonAdminToken = registerAndGetToken(nonAdminEmail, "Password1!", "Alice", "User", "0512345600");

        // Non-admin tries to fetch all users -> should be forbidden
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + nonAdminToken))
                .andExpect(status().isForbidden());
    }
}
