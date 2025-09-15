package com.restaurant.auth.auth_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor(force = true)
@RequiredArgsConstructor
public class UserResponse {
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String phoneNumber;
}
