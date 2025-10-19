package com.restaurant.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Common configuration class for RestTemplate bean setup across all microservices.
 *
 * <p>
 * This configuration provides a standardized RestTemplate bean for making HTTP requests
 * to external services, ensuring consistent configuration and behavior across all
 * microservices in the restaurant system.
 * </p>
 *
 * <p><b>Benefits:</b></p>
 * <ul>
 *   <li>Centralized configuration management</li>
 *   <li>Consistent HTTP client behavior</li>
 *   <li>Easy to extend with interceptors, timeouts, etc.</li>
 *   <li>Eliminates code duplication across services</li>
 * </ul>
 *
 * <p><b>Usage:</b> All microservices can inject this RestTemplate for inter-service
 * communication and external API calls.</p>
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Creates and configures a RestTemplate bean for HTTP communication.
     *
     * <p>
     * This RestTemplate is used for making HTTP requests to external services,
     * inter-service communication, and API calls throughout the microservices
     * architecture.
     * </p>
     *
     * <p><b>Future Enhancements:</b> This configuration can be extended with:</p>
     * <ul>
     *   <li>Connection timeouts</li>
     *   <li>Read timeouts</li>
     *   <li>Retry mechanisms</li>
     *   <li>Circuit breaker patterns</li>
     *   <li>Request/response interceptors</li>
     * </ul>
     *
     * @return a configured RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
