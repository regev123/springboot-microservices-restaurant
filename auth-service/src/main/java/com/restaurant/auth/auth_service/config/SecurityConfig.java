package com.restaurant.auth.auth_service.config;

import com.restaurant.auth.auth_service.service.UserLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration class for the authentication service.
 *
 * <p>This class defines password encoding, authentication handling,
 * and security rules for all incoming HTTP requests.</p>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserLookupService userLookupService;

    /**
     * Provides a custom {@link UserDetailsService} that retrieves users by email
     * using the {@link UserLookupService}.
     *
     * @return a {@link UserDetailsService} implementation
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return userLookupService::getUserByEmail;
    }

    /**
     * Defines the password encoder bean.
     * <p>Uses BCrypt for strong password hashing.</p>
     *
     * @return a {@link BCryptPasswordEncoder} instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the {@link AuthenticationManager} as a Spring bean.
     * <p>Required for programmatic authentication in services such as login.</p>
     *
     * @param config the {@link AuthenticationConfiguration} provided by Spring Security
     * @return the configured {@link AuthenticationManager}
     * @throws Exception if initialization fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Configures HTTP security rules, including CSRF handling and endpoint authorization.
     *
     * <p>Currently allows all requests for testing purposes. Should be updated
     * with role-based restrictions before production.</p>
     *
     * @param http the {@link HttpSecurity} builder
     * @return a configured {@link SecurityFilterChain} instance
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for APIs (enable for web apps if needed)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() 
                )
                .build();
    }
}
