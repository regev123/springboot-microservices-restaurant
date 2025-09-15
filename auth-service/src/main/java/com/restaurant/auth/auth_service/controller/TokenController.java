package com.restaurant.auth.auth_service.controller;

import com.restaurant.auth.auth_service.dto.TokenValidationRequest;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import com.restaurant.auth.auth_service.service.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Slf4j
public class TokenController {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public TokenController(@Qualifier("authJwtService") JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/validateTokenTimestamp")
    public ResponseEntity<String> validateTokenIssuedAt(@RequestBody TokenValidationRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not found");
        }

        if (request.getIssuedAt().isBefore(user.getPasswordModifiedDate())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token is outdated due to password change");
        }

        return ResponseEntity.ok("Token is valid");
    }
}
