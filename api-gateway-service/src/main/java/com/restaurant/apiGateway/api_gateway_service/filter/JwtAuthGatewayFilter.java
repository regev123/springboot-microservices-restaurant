package com.restaurant.apiGateway.api_gateway_service.filter;

import com.restaurant.apiGateway.api_gateway_service.service.JwtService;
import com.restaurant.apiGateway.api_gateway_service.util.JwtProperties;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthGatewayFilter implements GlobalFilter {

    private final JwtProperties jwtProperties;

    private final JwtService jwtService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Skip validation for whitelisted paths
        for (String whiteListedPath : jwtProperties.getWhitelist()) {
            if (path.startsWith(whiteListedPath)) {
                return chain.filter(exchange);
            }
        }

        // Require Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Validate JWT
        String token = authHeader.substring(7);
        Claims claims;
        try {
            claims = jwtService.validateToken(token);
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Add user info to headers for downstream services
        exchange = exchange.mutate().request(
                exchange.getRequest().mutate()
                        .header("X-User-Email", claims.getSubject())
                        .header("X-User-Role", claims.get("role", String.class))
                        .build()
        ).build();

        // Continue the filter chain
        return chain.filter(exchange);
    }
}
