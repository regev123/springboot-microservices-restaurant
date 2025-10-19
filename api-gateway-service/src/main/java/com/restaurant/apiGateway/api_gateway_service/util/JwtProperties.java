package com.restaurant.apiGateway.api_gateway_service.util;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Configuration class for JWT properties.
 * <p>
 * This class binds JWT-related settings from the application's
 * `application.properties` or `application.yml` file using the prefix {@code jwt}.
 * It provides the secret key and whitelist for JWT validation.
 * </p>
 */
@Component
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {

    /**
     * The secret key used to sign and verify JWT tokens.
     */
    private String secret;

    /**
     * The whitelist of paths that do not require JWT validation.
     */
    private List<String> whitelist;
}
