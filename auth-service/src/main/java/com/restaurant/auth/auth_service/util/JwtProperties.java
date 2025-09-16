package com.restaurant.auth.auth_service.util;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for JWT properties.
 *
 * <p>
 * This class binds JWT-related settings from the application's
 * `application.properties` or `application.yml` file using the prefix {@code jwt}.
 * It provides the secret key and expiration time required for generating and
 * validating JSON Web Tokens (JWTs).
 * </p>
 *
 * <h3>Example Configuration</h3>
 * <pre>
 * jwt.secret=ThisIsASecretKeyForJwtToken1234567890
 * jwt.expiration=3600000  # 1 hour in milliseconds
 * </pre>
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {

    /**
     * The secret key used to sign and verify JWT tokens.
     *
     * <p>
     * <strong>Important:</strong> This value must be at least 32 characters long
     * for HMAC-SHA256 (HS256) algorithm compatibility.
     * </p>
     */
    private String secret;

    /**
     * The validity period of the JWT token in milliseconds.
     *
     * <p>
     * Example:
     * <ul>
     *   <li>3600000 = 1 hour</li>
     *   <li>86400000 = 24 hours</li>
     * </ul>
     * </p>
     */
    private long expiration;
}
