package com.restaurant.auth.auth_service.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UserResponse {
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String phoneNumber;
}
