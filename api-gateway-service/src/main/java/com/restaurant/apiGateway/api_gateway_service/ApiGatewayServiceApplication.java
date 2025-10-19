package com.restaurant.apiGateway.api_gateway_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

/**
 * Bootstrap class for the API Gateway Service Spring Boot application.
 * <p>
 * Starts the application context and exposes REST endpoints for managing API gateways.
 * </p>
 */
@SpringBootApplication
@ComponentScan(basePackages = {
    "com.restaurant.apiGateway.api_gateway_service",
    "com.restaurant.common"
}, excludeFilters = {
    @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
        com.restaurant.common.security.aspect.AuthorizationAspect.class
    })
})
public class ApiGatewayServiceApplication {

	/**
	 * Main method to start the API Gateway Service application.
	 *
	 * @param args JVM command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayServiceApplication.class, args);
	}

}