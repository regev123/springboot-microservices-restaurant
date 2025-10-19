package com.restaurant.auth.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

/**
 * Represents a user in the authentication system.
 *
 * <p>This entity integrates with Spring Security by implementing {@link UserDetails},
 * enabling direct use for authentication and authorization purposes.</p>
 */
@Entity
@Table(name = "users")
@Data
public class UserEntity implements UserDetails {

    /** Unique identifier for the user */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique email address for user login */
    @Column(nullable = false, unique = true)
    private String email;

    /** Encrypted password for authentication */
    @Column(nullable = false)
    private String password;

    /** User's first name */
    @Column(nullable = false)
    private String firstName;

    /** User's last name */
    @Column(nullable = false)
    private String lastName;

    /** User's phone number */
    @Column(nullable = false, unique = true)
    private String phoneNumber;

    /** Timestamp when the user was created (immutable) */
    @Column(updatable = false, nullable = false)
    @CreatedDate
    private Instant createdDate = Instant.now();

    /** Timestamp when the password was last updated */
    @LastModifiedDate
    @Column(nullable = false)
    private Instant passwordModifiedDate = Instant.now();

    /** Role assigned to the user (e.g., ADMIN, USER, SUPERVISOR) */
    @Enumerated(EnumType.STRING)
    private Role role;

    /**
     * Returns the username for Spring Security authentication.
     * In this case, the username is the email.
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Returns a collection of authorities granted to the user.
     * Automatically prefixes role with "ROLE_" as required by Spring Security.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /**
     * Indicates whether the user's account is expired.
     * Always {@code true} since expiration is not tracked in this system.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user's account is locked.
     * Always {@code true} since locking is not implemented.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indicates whether the user's credentials (password) are expired.
     * Always {@code true} since password expiration is not tracked.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is enabled for authentication.
     * Always {@code true} unless a disabled feature is added in the future.
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
