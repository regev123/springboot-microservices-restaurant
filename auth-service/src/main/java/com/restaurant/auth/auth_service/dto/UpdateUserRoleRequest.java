package com.restaurant.auth.auth_service.dto;

import com.restaurant.auth.auth_service.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for updating a user's role.
 *
 * <p>This class is used in administrative operations where
 * a user's role needs to be changed, such as promoting a user
 * to a supervisor or admin.</p>
 */
@Data
public class UpdateUserRoleRequest {

    /**
     * The new role to assign to the user.
     *
     * <p>Cannot be null — validation is enforced to ensure that
     * a valid role is always provided.</p>
     */
    @NotNull(message = "Role is required")
    private Role newRole;
}
