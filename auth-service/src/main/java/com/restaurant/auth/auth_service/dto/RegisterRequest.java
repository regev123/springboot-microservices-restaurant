package com.restaurant.auth.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor(force = true)
@RequiredArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private final String email;

    @Size(min = 1, message = "Password is required")
    @Pattern(
            regexp = "^$|^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters long and include 1 uppercase letter, " +
                    "1 lowercase letter, 1 number, and 1 special character"
    )
    private final String password;

    @Size(min = 1, message = "First name is required")
    @Pattern(
            regexp = "^$|^[A-Za-z]{3,30}$",
            message = "First name must be only letters with 3-30 characters"
    )
    private final String firstName;

    @Size(min = 1, message = "Last name is required")
    @Pattern(
            regexp = "^$|^[A-Za-z]{3,30}$",
            message = "Last name must be only letters with 3-30 characters"
    )
    private final String lastName;

    @Size(min = 1, message = "Phone number is required")
    @Pattern(
            regexp = "^$|^05\\d{8}$",
            message = "Phone number must start with 05 and be exactly 10 digits"
    )
    private final String phoneNumber;
}