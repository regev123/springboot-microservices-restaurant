package com.restaurant.auth.auth_service.entity;

/**
 * Represents the different roles a user can have in the system.
 *
 * <p>These roles are used for authorization purposes and are
 * integrated with Spring Security. Each role corresponds to a
 * specific level of access within the application.</p>
 */
public enum Role {

    /** Standard user with basic access */
    USER,

    /** Supervisor with elevated privileges, such as managing users or resources */
    SUPERVISOR,

    /** Administrator with full access to all system operations */
    ADMIN
}
