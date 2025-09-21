package com.restaurant.auth.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object (DTO) for handling user password change requests.
 *
 * <p>
 * This DTO ensures that all necessary fields are provided and validated
 * before allowing a password update.
 * </p>
 */
@Data
@NoArgsConstructor(force = true)
@RequiredArgsConstructor
public class ChangePasswordRequest {

    /**
     * The email of the user requesting a password change.
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
     * The current password of the user, required for authentication
     * before allowing a password change.
     *
     * <p>Must:</p>
     * <ul>
     *   <li>Not be blank</li>
     *   <li>Be at least 8 characters long</li>
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
    @Size(min = 1, message = "Old password is required")
    @Pattern(
            regexp = "^$|^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters long and include 1 uppercase letter, " +
                    "1 lowercase letter, 1 number, and 1 special character"
    )
    private final String oldPassword;

    /**
     * The new password that will replace the user's current password.
     *
     * <p>Must:</p>
     * <ul>
     *   <li>Not be blank</li>
     *   <li>Be at least 8 characters long</li>
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
    @Size(min = 1, message = "New password is required")
    @Pattern(
            regexp = "^$|^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters long and include 1 uppercase letter, " +
                    "1 lowercase letter, 1 number, and 1 special character"
    )
    private final String newPassword;
}
