package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.UpdateUserRoleRequest;
import com.restaurant.auth.auth_service.dto.UserDetailsResponse;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import com.restaurant.auth.auth_service.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AdminService adminService;


    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        adminService.updateUserRole(userId, request);
        return ResponseEntity.ok("User role updated successfully");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserEntity>> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        List<UserEntity> users = adminService.getAllUsersExcludingCurrent(authHeader);
        return ResponseEntity.ok(users);
    }
}
