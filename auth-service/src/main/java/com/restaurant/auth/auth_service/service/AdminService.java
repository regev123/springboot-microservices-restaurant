package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.UpdateUserRoleRequest;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service that provides administrative operations such as
 * updating user roles and managing user listings.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserLookupService userLookupService;

    /**
     * Updates the role of a specific user.
     *
     * @param userId  the ID of the user whose role will be updated
     * @param request contains the new role to assign
     */
    public void updateUserRole(Long userId, UpdateUserRoleRequest request) {
        UserEntity user = userLookupService.getUserById(userId);
        user.setRole(request.getNewRole());
        userRepository.save(user);
    }

    /**
     * Retrieves all users except the currently logged-in user.
     *
     * @param currentEmail the email of the current logged-in user
     * @return a list of all users excluding the current one
     */
    public List<UserEntity> getAllUsersExcludingCurrent(String currentEmail) {
        return userRepository.findByEmailNot(currentEmail);
    }
}
