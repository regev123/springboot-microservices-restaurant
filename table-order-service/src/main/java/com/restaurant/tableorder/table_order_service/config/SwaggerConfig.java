package com.restaurant.tableorder.table_order_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI configuration for Table Order Service.
 * Provides API documentation and interactive testing interface.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI tableOrderServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Table Order Service API")
                        .description("Table and Order management service API documentation - Manage restaurant tables, orders, and order items")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Restaurant Management System")
                                .email("support@restaurant.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token obtained from auth service")));
    }
}

