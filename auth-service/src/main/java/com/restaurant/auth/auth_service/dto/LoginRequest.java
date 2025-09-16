package com.restaurant.auth.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object (DTO) for handling user login requests.
 *
 * <p>
 * This class is responsible for validating the credentials
 * provided by the user during login.
 * </p>
 */
@Data
@NoArgsConstructor(force = true)
@RequiredArgsConstructor
public class LoginRequest {

    /**
     * The email address of the user attempting to log in.
     *
     * <p>Must:</p>
     * <ul>
     *   <li>Not be blank</li>
     *   <li>Be in a valid email format</li>
     * </ul>
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private final String email;

    /**
     * The password of the user attempting to log in.
     *
     * <p>Must:</p>
     * <ul>
     *   <li>Not be blank</li>
     *   <li>Contain at least 8 characters</li>
     *   <li>Include at least:
     *      <ul>
     *          <li>1 uppercase letter</li>
     *          <li>1 lowercase letter</li>
     *          <li>1 number</li>
     *          <li>1 special character (@#$%^&+=!)</li>
     *      </ul>
     *   </li>
     * </ul>
     */
    @Size(min = 1, message = "Password is required")
    @Pattern(
            regexp = "^$|^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters long and include 1 uppercase letter, " +
                    "1 lowercase letter, 1 number, and 1 special character"
    )
    private final String password;
}
