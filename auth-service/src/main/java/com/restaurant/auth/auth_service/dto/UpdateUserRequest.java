package com.restaurant.auth.auth_service.dto;

import com.restaurant.auth.auth_service.entity.Role;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for updating a user's information.
 *
 * <p>This class is used in administrative operations where
 * a user's information needs to be updated, including personal details
 * and role assignment.</p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {

    /**
     * The unique identifier of the user being updated.
     * <p>Must not be null and must be a positive number.</p>
     */
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be a positive number")
    private Long id;

    /**
     * The user's first name.
     * <p>Must contain only letters and be between 3 and 30 characters.</p>
     */
    @Size(min = 1, message = "First name is required")
    @Pattern(
            regexp = "^$|^[A-Za-z]{3,30}$",
            message = "First name must be only letters with 3-30 characters"
    )
    private String firstName;

    /**
     * The user's last name.
     * <p>Must contain only letters and be between 3 and 30 characters.</p>
     */
    @Size(min = 1, message = "Last name is required")
    @Pattern(
            regexp = "^$|^[A-Za-z]{3,30}$",
            message = "Last name must be only letters with 3-30 characters"
    )
    private String lastName;

    /**
     * The user's phone number.
     * <p>Must:
     * <ul>
     *   <li>Start with "05"</li>
     *   <li>Be exactly 10 digits</li>
     * </ul>
     * </p>
     */
    @Size(min = 1, message = "Phone number is required")
    @Pattern(
            regexp = "^$|^05\\d{8}$",
            message = "Phone number must start with 05 and be exactly 10 digits"
    )
    private String phoneNumber;

    /**
     * The new role to assign to the user.
     * <p>Cannot be null — validation ensures a valid role is provided.</p>
     */
    @NotNull(message = "Role is required")
    private Role role;
}
