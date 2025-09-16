package com.restaurant.auth.auth_service.service;

import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.util.JwtProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Service responsible for generating JWT tokens.
 *
 * <p>This class handles JWT creation for authenticated users,
 * embedding essential claims like username and role inside the token.</p>
 */
@Service("authJwtService")
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;
    private final UserLookupService userLookupService;

    /**
     * Generates a signed JWT token for a given user.
     *
     * @param user the authenticated user details
     * @return a signed JWT token containing the user's email and role
     */
    public String generateToken(UserDetails user) {
        UserEntity userEntity = userLookupService.getUserByEmail(user.getUsername());

        return Jwts.builder()
                .setSubject(user.getUsername()) // Subject represents the user's email
                .claim("role", userEntity.getRole()) // Include the user's role as a claim
                .setIssuedAt(new Date()) // Token creation timestamp
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration())) // Token expiration
                .signWith(
                        Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes()),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }
}
