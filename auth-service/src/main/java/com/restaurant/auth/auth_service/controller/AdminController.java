package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.*;
import com.restaurant.auth.auth_service.service.AdminService;
import com.restaurant.auth.auth_service.util.AuthorizationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final AuthorizationUtil authorizationUtil;
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
    public ResponseEntity<UpdateUserRoleResponse> updateUserRole(
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable("userId") Long userId,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.ok(adminService.updateUserRole(userId, request));
    }

    /**
     * Retrieves all users excluding the currently logged-in admin.
     *
     * <p>Only accessible to users with the ADMIN role.</p>
     *
     * @return a list of all users excluding the currently authenticated admin
     */
    @GetMapping("/users")
    public ResponseEntity<UsersWithRolesResponse> getAllUsers(
            @RequestHeader("X-User-Role") String userRole,
            @RequestHeader("X-User-Email") String userEmail
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        List<UserDetailsDto> users = adminService.getAllUsersExcludingCurrent(userEmail);
        log.info("in getAllUsers the user list is : {}", users.toString());
        List<String> roles = adminService.getAllRolesList();
        return ResponseEntity.ok(new UsersWithRolesResponse(users, roles));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable("userId") Long userId
    ) {
        authorizationUtil.checkRole(userRole, "ADMIN");
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully!");
    }

    /**
     * Registers a new user.
     *
     * @param request the registration details (validated)
     * @return an authentication response containing a JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestHeader("X-User-Role") String userRole,
                                           @Valid @RequestBody RegisterRequest request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        adminService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }
}
