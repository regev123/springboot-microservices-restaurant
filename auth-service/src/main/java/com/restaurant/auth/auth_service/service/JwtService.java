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
 * Service responsible for generating JSON Web Tokens (JWT) for authenticated users.
 *
 * <p>
 * This service creates cryptographically signed tokens that contain user-specific claims
 * such as email (subject) and role, using HMAC SHA-256 for signing.
 * </p>
 *
 * <p><b>Security Note:</b> The secret key is defined in {@link JwtProperties} and should be
 * securely managed via environment variables or configuration management tools.</p>
 */
@Service("authJwtService")
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;
    private final UserLookupService userLookupService;

    // ---------------------------------------------------------------------
    // Token Generation
    // ---------------------------------------------------------------------

    /**
     * Generates a signed JWT token for the given authenticated user.
     *
     * <p>
     * The generated token includes:
     * <ul>
     *     <li><b>Subject:</b> The user's email</li>
     *     <li><b>Role Claim:</b> The user's assigned role</li>
     *     <li><b>Issued At:</b> The token creation time</li>
     *     <li><b>Expiration:</b> A future timestamp based on configured TTL</li>
     * </ul>
     * </p>
     *
     * @param user the {@link UserDetails} representing the authenticated user
     * @return a signed JWT token containing encoded user details
     */
    public String generateToken(UserDetails user) {
        UserEntity userEntity = userLookupService.getUserByEmail(user.getUsername());
        Date now = new Date();
        Date expiration = new Date(System.currentTimeMillis() + jwtProperties.getExpiration());

        return Jwts.builder()
                .setSubject(user.getUsername()) // Subject represents the user's email
                .claim("role", userEntity.getRole()) // Include the user's role claim
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(
                        Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes()),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }
}
