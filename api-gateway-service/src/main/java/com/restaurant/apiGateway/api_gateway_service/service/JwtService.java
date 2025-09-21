package com.restaurant.apiGateway.api_gateway_service.service;

import com.restaurant.apiGateway.api_gateway_service.dto.TokenValidationRequest;
import com.restaurant.apiGateway.api_gateway_service.exception.TokenOutdatedException;
import com.restaurant.apiGateway.api_gateway_service.util.JwtProperties;
import com.restaurant.common.exception.UserNotFoundException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.Key;
import java.util.Date;

@Service("gatewayJwtService")
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    private final JwtProperties jwtProperties;

    @Value("${auth.service.url}")
    private String authServiceBaseUrl;

    private final RestTemplate restTemplate;

    public Claims validateToken(String token) {
        Claims claims = extractAndValidateSignature(token);
        validateExpiration(claims);
        sendTokenValidationRequest(claims);
        return claims;
    }

    private Claims extractAndValidateSignature(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // validates signature
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private void validateExpiration(Claims claims) {
        Date expiration = claims.getExpiration();
        if (expiration.before(new Date())) {
            throw new ExpiredJwtException((Header<?>) null, claims, "JWT token is expired");
        }
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    private void sendTokenValidationRequest(Claims claims) {
        final String url = String.format("%s/auth/validateTokenTimestamp", authServiceBaseUrl);

        TokenValidationRequest requestBody = new TokenValidationRequest(
                claims.getSubject(), // email from JWT
                claims.getIssuedAt().toInstant() // issuedAt from JWT
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TokenValidationRequest> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return;
        }

        throw mapResponseToException((HttpStatus) response.getStatusCode(), response.getBody());
    }

    private RuntimeException mapResponseToException(HttpStatus status, String responseBody) {
        return "User not found".equalsIgnoreCase(responseBody)
                ? new UserNotFoundException("The specified user does not exist.")
                : new TokenOutdatedException("The provided token is outdated due to a recent password change.");
    }
}
