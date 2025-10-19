package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.dto.RegisterRequest;
import com.restaurant.auth.auth_service.dto.UpdateUserRequest;
import com.restaurant.auth.auth_service.dto.UserDetailsDto;
import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.mapper.UserMapper;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service that provides administrative operations for managing users and roles.
 *
 * <p>
 * This service includes operations such as:
 * <ul>
 *   <li>Updating user roles</li>
 *   <li>Listing users (excluding the current one)</li>
 *   <li>Deleting users</li>
 *   <li>Registering new users</li>
 * </ul>
 * </p>
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserLookupService userLookupService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // ---------------------------------------------------------------------
    // Update User Information
    // ---------------------------------------------------------------------

    /**
     * Updates the information of a specific user.
     *
     * <p>Updates the user's first name, last name, phone number, and role.
     * Email and password are not updated through this method.</p>
     *
     * @param request the {@link UpdateUserRequest} containing the user ID and updated information
     * @throws com.restaurant.common.exception.UserNotFoundException if the user does not exist
     */
    public void updateUser(UpdateUserRequest request) {
        UserEntity user = userLookupService.getUserById(request.getId());
        
        // Validate phone number uniqueness (excluding current user)
        userLookupService.validatePhoneNumberUniquenessExcludingUser(request.getPhoneNumber(), request.getId());
        
        // Update user fields (excluding email and password)
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        
        userRepository.save(user);
    }

    // ---------------------------------------------------------------------
    // Retrieve All Users (Excluding Current)
    // ---------------------------------------------------------------------

    /**
     * Retrieves all users excluding the currently logged-in user.
     *
     * @param currentEmail the email address of the currently authenticated user
     * @return a list of {@link UserDetailsDto} excluding the current user
     */
    public List<UserDetailsDto> getAllUsersExcludingCurrent(String currentEmail) {
        List<UserEntity> users = userRepository.findByEmailNot(currentEmail);
        return mapToUserDetailsDtoList(users);
    }

    /**
     * Maps a list of {@link UserEntity} objects to {@link UserDetailsDto} objects.
     *
     * @param users list of user entities
     * @return a list of user detail DTOs
     */
    private List<UserDetailsDto> mapToUserDetailsDtoList(List<UserEntity> users) {
        return users.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // Retrieve All Roles
    // ---------------------------------------------------------------------

    /**
     * Retrieves all available roles defined in the system.
     *
     * @return a list of {@link Role} values
     */
    public List<Role> getAllRolesList() {
        return Arrays.asList(Role.values());
    }

    // ---------------------------------------------------------------------
    // Delete User
    // ---------------------------------------------------------------------

    /**
     * Deletes a user by their unique ID.
     *
     * @param userId the ID of the user to delete
     * @throws com.restaurant.common.exception.UserNotFoundException if the user does not exist
     */
    public void deleteUser(Long userId) {
        userLookupService.isUserExistById(userId);
        userRepository.deleteById(userId);
    }

    // ---------------------------------------------------------------------
    // Register New User
    // ---------------------------------------------------------------------

    /**
     * Registers a new user in the system.
     *
     * <p>
     * The password is securely encoded before saving the user to the database.
     * </p>
     *
     * @param request the {@link RegisterRequest} containing new user details
     * @return {@link UserDetailsDto} containing the created user's details
     * @throws com.restaurant.auth.auth_service.exceptions.UserAlreadyExistsException
     *         if a user with the same email already exists
     */
    public UserDetailsDto register(RegisterRequest request) {
        userLookupService.validateEmailUniqueness(request.getEmail());
        userLookupService.validatePhoneNumberUniqueness(request.getPhoneNumber());
        UserEntity newUser = buildNewUser(request);
        UserEntity savedUser = userRepository.save(newUser);
        return userMapper.toDto(savedUser);
    }

    // ---------------------------------------------------------------------
    // Helper Method: Build New User Entity
    // ---------------------------------------------------------------------

    /**
     * Builds a new {@link UserEntity} from a registration request.
     *
     * @param request the registration data
     * @return a fully initialized {@link UserEntity} instance
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
