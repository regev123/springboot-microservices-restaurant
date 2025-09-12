package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.UpdateUserRoleRequest;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public void updateUserRole(Long userId, UpdateUserRoleRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setRole(request.getNewRole());
        userRepository.save(user);
    }

    public List<UserEntity> getAllUsersExcludingCurrent(String authHeader) {
        // Extract email (username) from token
        String token = authHeader.substring(7); // remove "Bearer "
        String currentEmail = jwtService.extractUsername(token);

        // Fetch all users
        return userRepository.findAll()
                .stream()
                .filter(user -> !user.getEmail().equals(currentEmail)) // Exclude the current user
                .toList();
    }
}
