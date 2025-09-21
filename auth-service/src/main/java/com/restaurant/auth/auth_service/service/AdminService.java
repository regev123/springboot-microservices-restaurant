package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.*;
import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.exceptions.UserAlreadyExistsException;
import com.restaurant.auth.auth_service.repository.UserRepository;
import com.restaurant.common.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service that provides administrative operations such as
 * updating user roles and managing user listings.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserLookupService userLookupService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Updates the role of a specific user.
     *
     * @param userId  the ID of the user whose role will be updated
     * @param request contains the new role to assign
     */
    public UpdateUserRoleResponse updateUserRole(Long userId, UpdateUserRoleRequest request) {
        UserEntity user = userLookupService.getUserById(userId);
        user.setRole(request.getNewRole());
        userRepository.save(user);
        return new UpdateUserRoleResponse(userId,request.getNewRole());
    }

    /**
     * Retrieves all users except the currently logged-in user.
     *
     * @param currentEmail the email of the current logged-in user
     * @return a list of all users excluding the current one
     */
    public List<UserDetailsDto> getAllUsersExcludingCurrent(String currentEmail) {
        return toUserDetailsDtoList(userRepository.findByEmailNot(currentEmail));
    }

    public static List<UserDetailsDto> toUserDetailsDtoList(List<UserEntity> entities) {
        return entities.stream()
                .map(user -> new UserDetailsDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getPhoneNumber(),
                        user.getRole(),
                        user.getCreatedDate(),
                        user.getPasswordModifiedDate()
                ))
                .collect(Collectors.toList());
    }

    public List<String> getAllRolesList() {
        return Arrays.stream(Role.values()).map(Enum::name).toList();
    }

    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User with ID " + userId + " not found");
        }
        userRepository.deleteById(userId);
    }

    /**
     * Registers a new user and returns a JWT token for authentication.
     *
     * @param request registration request containing user details
     */
    public void register(RegisterRequest request) {
        validateEmailUniqueness(request.getEmail());

        UserEntity user = buildNewUser(request);
        userRepository.save(user);
    }

    /**
     * Ensures that no other user exists with the same email.
     *
     * @param email email to validate
     */
    private void validateEmailUniqueness(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("A user with this email is already registered.");
        }
    }

    /**
     * Builds a new user entity from the registration request.
     *
     * @param request registration data
     * @return a new UserEntity instance
     */
    private UserEntity buildNewUser(RegisterRequest request) {
        Instant now = Instant.now();

        UserEntity user = new UserEntity();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCreatedDate(now);
        user.setPasswordModifiedDate(now);
        user.setRole(Role.valueOf(request.getRole()));

        return user;
    }
}
