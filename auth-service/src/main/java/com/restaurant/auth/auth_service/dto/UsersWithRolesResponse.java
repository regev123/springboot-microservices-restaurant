package com.restaurant.auth.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UsersWithRolesResponse {
    private List<UserDetailsDto> users;
    private List<String> roles;
}
