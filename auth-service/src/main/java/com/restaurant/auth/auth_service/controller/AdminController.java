package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.UpdateUserRoleRequest;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for administrative operations related to users.
 *
 * <p>
 * Provides endpoints for managing user roles and retrieving a list of all users,
 * excluding the currently authenticated admin.
 * </p>
 */
@RestController
@RequestMapping("/auth/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * Updates the role of a specific user.
     *
     * <p>Only accessible to users with the ADMIN role.</p>
     *
     * @param userId  the ID of the user whose role will be updated
     * @param request contains the new role for the user
     * @return HTTP 200 OK with a success message
     */
    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        adminService.updateUserRole(userId, request);
        return ResponseEntity.ok("User role updated successfully");
    }

    /**
     * Retrieves all users excluding the currently logged-in admin.
     *
     * <p>Only accessible to users with the ADMIN role.</p>
     *
     * @param authHeader the "Authorization" header containing the JWT token
     * @return a list of all users excluding the currently authenticated admin
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserEntity>> getAllUsers(
            @RequestHeader("Authorization") String authHeader
    ) {
        List<UserEntity> users = adminService.getAllUsersExcludingCurrent(authHeader);
        return ResponseEntity.ok(users);
    }
}
