package com.restaurant.auth.auth_service.dto;

import com.restaurant.auth.auth_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Data Transfer Object (DTO) for returning detailed user information.
 *
 * <p>This class is used when detailed user data is needed,
 * such as for administrative views or account management.</p>
 *
 * <p><b>Note:</b> This DTO may include sensitive fields like
 * {@code passwordModifiedDate}. Ensure it is returned only to
 * authorized clients (e.g., admins or the user themselves).</p>
 */
@Data
@NoArgsConstructor(force = true) // Required for JSON deserialization
@AllArgsConstructor              // Generates a full-args constructor for easy initialization
public class UserDetailsDto {

    /** Unique identifier of the user */
    private Long id;

    /** Unique email address used for authentication */
    private String email;

    /** User's first name */
    private String firstName;

    /** User's last name */
    private String lastName;

    /** User's phone number */
    private String phoneNumber;

    /** Role assigned to the user (e.g., ADMIN, SUPERVISOR, USER) */
    private Role role;

    /** Timestamp when the user account was created */
    private Instant createdDate;

    /** Timestamp of the last password change */
    private Instant passwordModifiedDate;
}
