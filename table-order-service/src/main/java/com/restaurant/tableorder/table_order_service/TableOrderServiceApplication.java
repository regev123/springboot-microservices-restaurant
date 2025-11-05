package com.restaurant.tableorder.table_order_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Bootstrap class for the Table Order Service Spring Boot application.
 * <p>
 * Starts the application context and exposes REST endpoints for managing tables,
 * orders, and order items.
 * </p>
 */
@SpringBootApplication
public class TableOrderServiceApplication {
    /**
     * Application entry point.
     *
     * @param args JVM command-line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(TableOrderServiceApplication.class, args);
    }
}

