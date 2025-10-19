package com.restaurant.auth.auth_service;

/**
 * Bootstrap class for the Authentication Service Spring Boot application.
 * <p>
 * Starts the application context and exposes REST endpoints for managing authentication and authorization.
 * </p>
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Authentication Service.
 */
@SpringBootApplication
public class AuthenticationServiceApplication {

	/**
	 * Main method to start the Authentication Service application.
	 *
	 * @param args JVM command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(AuthenticationServiceApplication.class, args);
	}
}
