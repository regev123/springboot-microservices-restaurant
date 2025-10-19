package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.exceptions.UserAlreadyExistsException;
import com.restaurant.auth.auth_service.repository.UserRepository;
import com.restaurant.common.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service responsible for retrieving and validating user data from the database.
 *
 * <p>
 * Provides utility methods for fetching users by email or ID, verifying existence,
 * and ensuring email uniqueness during registration.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class UserLookupService {

    // ==================== CONSTANTS ====================
    // Error Messages
    private static final String USER_NOT_FOUND_EMAIL_MSG = "User not found with email: %s";
    private static final String USER_NOT_FOUND_ID_MSG = "User not found with ID: %s";
    private static final String EMAIL_ALREADY_EXISTS_MSG = "A user with this email is already registered.";
    private static final String PHONE_ALREADY_EXISTS_MSG = "A user with this phone number is already registered.";
    
    // ==================== DEPENDENCIES ====================
    private final UserRepository userRepository;

    // ---------------------------------------------------------------------
    // Retrieve User by Email
    // ---------------------------------------------------------------------

    /**
     * Retrieves a user by their email address.
     *
     * @param email the email address of the user to retrieve
     * @return the {@link UserEntity} associated with the given email
     * @throws UserNotFoundException if no user is found with the provided email
     */
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(String.format(USER_NOT_FOUND_EMAIL_MSG, email)));
    }

    // ---------------------------------------------------------------------
    // Retrieve User by ID
    // ---------------------------------------------------------------------

    /**
     * Retrieves a user by their unique identifier.
     *
     * @param userId the ID of the user to retrieve
     * @return the {@link UserEntity} associated with the given ID
     * @throws UserNotFoundException if no user is found with the provided ID
     */
    public UserEntity getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(String.format(USER_NOT_FOUND_ID_MSG, userId)));
    }

    // ---------------------------------------------------------------------
    // Check User Existence by ID
    // ---------------------------------------------------------------------

    /**
     * Checks whether a user exists in the system by their unique identifier.
     *
     * @param userId the ID of the user to check
     * @throws UserNotFoundException if the user does not exist
     */
    public void isUserExistById(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(String.format(USER_NOT_FOUND_ID_MSG, userId));
        }
    }

    // ---------------------------------------------------------------------
    // Validate Email Uniqueness
    // ---------------------------------------------------------------------

    /**
     * Ensures that no user already exists with the given email.
     *
     * <p>
     * This method is typically used during user registration to prevent
     * duplicate accounts with the same email address.
     * </p>
     *
     * @param email the email to validate
     * @throws UserAlreadyExistsException if a user with the given email already exists
     */
    public void validateEmailUniqueness(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException(EMAIL_ALREADY_EXISTS_MSG);
        }
    }

    /**
     * Ensures that no user already exists with the given phone number.
     *
     * <p>
     * This method is used during user registration to prevent
     * duplicate accounts with the same phone number.
     * </p>
     *
     * @param phoneNumber the phone number to validate
     * @throws UserAlreadyExistsException if a user with the given phone number already exists
     */
    public void validatePhoneNumberUniqueness(String phoneNumber) {
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new UserAlreadyExistsException(PHONE_ALREADY_EXISTS_MSG);
        }
    }

    /**
     * Ensures that no user already exists with the given phone number, excluding a specific user.
     *
     * <p>
     * This method is used during user updates to prevent duplicate phone numbers
     * while allowing the current user to keep their existing phone number.
     * </p>
     *
     * @param phoneNumber the phone number to validate
     * @param excludeUserId the ID of the user to exclude from the check
     * @throws UserAlreadyExistsException if another user with the given phone number already exists
     */
    public void validatePhoneNumberUniquenessExcludingUser(String phoneNumber, Long excludeUserId) {
        Optional<UserEntity> existingUser = userRepository.findByPhoneNumber(phoneNumber);
        if (existingUser.isPresent() && !existingUser.get().getId().equals(excludeUserId)) {
            throw new UserAlreadyExistsException(PHONE_ALREADY_EXISTS_MSG);
        }
    }
}
