package com.restaurant.apiGateway.api_gateway_service.config;

import com.restaurant.apiGateway.api_gateway_service.filter.JwtAuthGatewayFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class GatewayConfig {

    private final JwtAuthGatewayFilter jwtAuthGatewayFilter;

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**")
                        .filters(f -> f.filter(jwtAuthGatewayFilter).stripPrefix(1))
                        .uri("http://localhost:8082"))
                .build();
    }
}
