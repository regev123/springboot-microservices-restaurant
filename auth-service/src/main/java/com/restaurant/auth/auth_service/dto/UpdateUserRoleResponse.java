package com.restaurant.auth.auth_service.dto;

import com.restaurant.auth.auth_service.entity.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UpdateUserRoleResponse {
    private final Long userId;
    private final Role newRole;
}
