package com.restaurant.auth.auth_service.dto;

import com.restaurant.auth.auth_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * Data Transfer Object (DTO) for returning users and available roles in a single response.
 *
 * <p>This DTO is typically used in administrative interfaces where both user data
 * and available role options need to be displayed together, such as user management
 * pages or user creation forms.</p>
 *
 * <p><b>Usage:</b> This response is commonly returned by admin endpoints that need
 * to provide both the list of users and the available roles for dropdown selections
 * or role assignment interfaces.</p>
 */
@Data
@AllArgsConstructor
public class UsersWithRolesResponse {
    
    /**
     * List of user details excluding the current admin user.
     * Contains comprehensive user information for administrative purposes.
     */
    private List<UserDetailsDto> users;
    
    /**
     * List of all available roles in the system.
     * Used for role selection dropdowns and role assignment interfaces.
     */
    private List<Role> roles;
}
