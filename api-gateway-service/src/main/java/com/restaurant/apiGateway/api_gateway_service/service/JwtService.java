package com.restaurant.apiGateway.api_gateway_service.service;

import com.restaurant.apiGateway.api_gateway_service.dto.TokenValidationRequest;
import com.restaurant.apiGateway.api_gateway_service.exception.TokenOutdatedException;
import com.restaurant.apiGateway.api_gateway_service.util.JwtProperties;
import com.restaurant.common.exception.UserNotFoundException;
import com.restaurant.common.service.HttpUtilityService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Service responsible for validating JSON Web Tokens (JWT) for authenticated users.
 * <p>
 * This service validates the signature and expiration of JWT tokens, and sends a request to the Authentication Service
 * to validate the token timestamp.
 */
@Service("gatewayJwtService")
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    // ==================== CONSTANTS ====================
    // Error Messages
    private static final String TOKEN_NULL_EMPTY_MSG = "Token cannot be null or empty";
    private static final String JWT_EXPIRED_MSG = "JWT token is expired";
    
    // URL Templates
    private static final String TOKEN_VALIDATION_URL_TEMPLATE = "%s/auth/validateTokenTimestamp";
    
    // ==================== DEPENDENCIES ====================
    private final JwtProperties jwtProperties;
    private final HttpUtilityService httpUtilityService;

    @Value("${auth.service.url}")
    private String authServiceBaseUrl;

    /**
     * Validates a JWT token.
     * <p>
     * This method extracts the claims from the JWT token, validates the signature and expiration, and sends a request to the Authentication Service
     * to validate the token timestamp.
     * </p>
     *
     * @param token the JWT token to validate
     * @return the claims from the JWT token
     * @throws IllegalArgumentException if the token is null or empty
     */
    public Claims validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException(TOKEN_NULL_EMPTY_MSG);
        }
        
        Claims claims = extractAndValidateSignature(token);
        validateExpiration(claims);
        sendTokenValidationRequest(claims);
        return claims;
    }

    /**
     * Extracts the claims from the JWT token and validates the signature.
     * <p>
     * This method extracts the claims from the JWT token and validates the signature using the signing key.
     * </p>
     *
     * @param token the JWT token to extract the claims from
     * @return the claims from the JWT token
     */
    private Claims extractAndValidateSignature(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // validates signature
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Validates the expiration of the JWT token.
     * <p>
     * This method validates the expiration of the JWT token and throws an exception if the token is expired.
     * </p>
     *
     * @param claims the claims from the JWT token
     */
    private void validateExpiration(Claims claims) {
        Date expiration = claims.getExpiration();
        if (expiration.before(new Date())) {
            throw new ExpiredJwtException((Header<?>) null, claims, JWT_EXPIRED_MSG);
        }
    }

    /**
     * Gets the signing key for the JWT token.
     * <p>
     * This method gets the signing key for the JWT token from the JwtProperties.
     * </p>
     *
     * @return the signing key for the JWT token
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    /**
     * Sends a request to the Authentication Service to validate the token timestamp.
     * <p>
     * This method sends a request to the Authentication Service to validate the token timestamp.
     * </p>
     *
     * @param claims the claims from the JWT token
     */
    private void sendTokenValidationRequest(Claims claims) {
        final String url = String.format(TOKEN_VALIDATION_URL_TEMPLATE, authServiceBaseUrl);

        TokenValidationRequest requestBody = new TokenValidationRequest(
            claims.getSubject(), // email from JWT
            claims.getIssuedAt().toInstant() // issuedAt from JWT
        );
        
        httpUtilityService.postJsonRequest(url, requestBody, Void.class);
    }   
}
