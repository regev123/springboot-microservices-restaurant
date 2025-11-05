package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.*;
import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.service.AdminService;
import com.restaurant.auth.auth_service.util.AuthorizationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller that exposes administrative endpoints for managing users.
 *
 * <p>
 * Provides APIs for performing user-related administrative actions such as:
 * <ul>
 *     <li>Updating user roles</li>
 *     <li>Retrieving all users (excluding the current admin)</li>
 *     <li>Deleting users</li>
 *     <li>Registering new users</li>
 * </ul>
 * </p>
 *
 * <p><b>Access Control:</b> All endpoints are restricted to users with the ADMIN role.</p>
 */
@RestController
@RequestMapping("/auth/admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Management", description = "Administrative endpoints for managing users. All endpoints require ADMIN role.")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    private final AdminService adminService;
    private final AuthorizationUtil authorizationUtil;

    // ---------------------------------------------------------------------
    // Endpoint: Update User Information
    // ---------------------------------------------------------------------

    /**
     * Updates the information of a specific user.
     *
     * <p>Only accessible to users with the ADMIN role.</p>
     * <p>Updates user's first name, last name, phone number, and role.</p>
     * <p>Email and password are not updatable through this endpoint.</p>
     *
     * @param userRole the role of the authenticated user (from request header)
     * @param request  the payload containing the user ID and updated information
     * @return {@link ResponseEntity} with status 204 (No Content) if successful
     */
    @PutMapping("/user/update")
    @Operation(summary = "Update user", description = "Updates user information (first name, last name, phone number, role). Email and password are not updatable. Requires ADMIN role.")
    public ResponseEntity<Void> updateUser(
            @RequestHeader("X-User-Role") String userRole,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        authorizationUtil.checkRole(userRole, "ADMIN");
        adminService.updateUser(request);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: Retrieve All Users (Excluding Current)
    // ---------------------------------------------------------------------

    /**
     * Retrieves all registered users excluding the currently authenticated admin.
     *
     * <p>Only accessible to users with the ADMIN role.</p>
     *
     * @param userRole  the role of the authenticated user (from request header)
     * @param userEmail the email of the authenticated user (from request header)
     * @return {@link ResponseEntity} containing a {@link UsersWithRolesResponse}
     */
    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Retrieves all registered users excluding the currently authenticated admin. Requires ADMIN role.")
    public ResponseEntity<UsersWithRolesResponse> getAllUsers(
            @RequestHeader("X-User-Role") String userRole,
            @RequestHeader("X-User-Email") String userEmail
    ) {
        authorizationUtil.checkRole(userRole, "ADMIN");

        List<UserDetailsDto> users = adminService.getAllUsersExcludingCurrent(userEmail);
        List<Role> roles = adminService.getAllRolesList();

        return ResponseEntity.ok(new UsersWithRolesResponse(users, roles));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Delete User
    // ---------------------------------------------------------------------

    /**
     * Deletes a user by their unique identifier.
     *
     * <p>Only accessible to users with the ADMIN role.</p>
     *
     * @param userRole the role of the authenticated user (from request header)
     * @param userId   the ID of the user to be deleted
     * @return {@link ResponseEntity} with status 204 (No Content) if successful
     */
    @DeleteMapping("/user/{userId}/delete")
    @Operation(summary = "Delete user", description = "Deletes a user by their unique identifier. Requires ADMIN role.")
    public ResponseEntity<Void> deleteUser(
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable("userId") Long userId
    ) {
        authorizationUtil.checkRole(userRole, "ADMIN");
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: Register New User
    // ---------------------------------------------------------------------

    /**
     * Registers a new user in the system.
     *
     * <p>Only accessible to users with the ADMIN role.</p>
     *
     * @param userRole the role of the authenticated user (from request header)
     * @param request  the registration payload containing user details
     * @return {@link ResponseEntity} containing the created user details
     */
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Registers a new user in the system. Requires ADMIN role.")
    public ResponseEntity<UserDetailsDto> registerUser(
            @RequestHeader("X-User-Role") String userRole,
            @Valid @RequestBody RegisterRequest request
    ) {
        authorizationUtil.checkRole(userRole, "ADMIN");
        UserDetailsDto createdUser = adminService.register(request);
        return ResponseEntity.ok(createdUser);
    }
}
