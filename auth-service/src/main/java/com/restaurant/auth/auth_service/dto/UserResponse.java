package com.restaurant.auth.auth_service.dto;

import com.restaurant.auth.auth_service.entity.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object (DTO) for returning user information
 * in API responses.
 *
 * <p>This DTO contains only non-sensitive fields to ensure that
 * sensitive data such as passwords are never exposed in responses.</p>
 */
@Data
@NoArgsConstructor(force = true) // Required for frameworks like Jackson during deserialization
@RequiredArgsConstructor        // Generates a constructor for final fields
public class UserResponse {

    /** The unique email address of the user */
    private final String email;

    /** The user's first name */
    private final String firstName;

    /** The user's last name */
    private final String lastName;

    /** The user's phone number */
    private final String phoneNumber;

    private final Role role;
}
