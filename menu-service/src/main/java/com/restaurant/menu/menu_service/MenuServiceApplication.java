package com.restaurant.menu.menu_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Bootstrap class for the Menu Service Spring Boot application.
 * <p>
 * Starts the application context and exposes REST endpoints for managing menus,
 * categories, and menu items.
 * </p>
 */
@SpringBootApplication
public class MenuServiceApplication {
    /**
     * Application entry point.
     *
     * @param args JVM command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(MenuServiceApplication.class, args);
    }
}
