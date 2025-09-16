package com.restaurant.auth.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object (DTO) for user registration.
 *
 * <p>This class encapsulates all the fields and validation rules
 * required to register a new user in the system.</p>
 */
@Data
@NoArgsConstructor(force = true) // Required by frameworks like Jackson for JSON deserialization
@RequiredArgsConstructor         // Convenient constructor for creating instances with all final fields
public class RegisterRequest {

    /**
     * The user's email.
     * <p>Must be provided and follow a valid email format.</p>
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private final String email;

    /**
     * The user's password.
     * <p>
     * Requirements:
     * <ul>
     *   <li>At least 8 characters</li>
     *   <li>One uppercase letter</li>
     *   <li>One lowercase letter</li>
     *   <li>One digit</li>
     *   <li>One special character (@#$%^&+=!)</li>
     * </ul>
     * </p>
     */
    @Size(min = 1, message = "Password is required")
    @Pattern(
            regexp = "^$|^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters long and include 1 uppercase letter, " +
                    "1 lowercase letter, 1 number, and 1 special character"
    )
    private final String password;

    /**
     * The user's first name.
     * <p>Must contain only letters and be between 3 and 30 characters.</p>
     */
    @Size(min = 1, message = "First name is required")
    @Pattern(
            regexp = "^$|^[A-Za-z]{3,30}$",
            message = "First name must be only letters with 3-30 characters"
    )
    private final String firstName;

    /**
     * The user's last name.
     * <p>Must contain only letters and be between 3 and 30 characters.</p>
     */
    @Size(min = 1, message = "Last name is required")
    @Pattern(
            regexp = "^$|^[A-Za-z]{3,30}$",
            message = "Last name must be only letters with 3-30 characters"
    )
    private final String lastName;

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
    private final String phoneNumber;
}
