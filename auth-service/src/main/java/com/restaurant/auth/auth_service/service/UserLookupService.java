package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.common.exception.UserNotFoundException;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service responsible for fetching user details from the database.
 */
@Service
@RequiredArgsConstructor
public class UserLookupService {

    private final UserRepository userRepository;

    /**
     * Retrieves a user by their email address.
     *
     * @param email the email of the user to find
     * @return the UserEntity associated with the given email
     * @throws UserNotFoundException if no user is found with the provided email
     */
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    /**
     * Retrieves a user by their unique ID.
     *
     * @param userId the ID of the user to find
     * @return the UserEntity associated with the given ID
     * @throws UsernameNotFoundException if no user is found with the provided ID
     */
    public UserEntity getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }
}
