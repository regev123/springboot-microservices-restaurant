package com.restaurant.auth.auth_service.config;

import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Random;
import java.util.stream.IntStream;

/**
 * Initializes the system with 10 random USER accounts at startup.
 *
 * <p>
 * This is mainly for development/testing purposes when using an in-memory
 * database like H2. Each generated user has a unique email and random names.
 * </p>
 */
@Configuration
@Slf4j
public class UserInitializer {

    private static final String[] FIRST_NAMES = {
            "John", "Emma", "Michael", "Sophia", "David",
            "Olivia", "Daniel", "Isabella", "James", "Mia"
    };

    private static final String[] LAST_NAMES = {
            "Smith", "Johnson", "Brown", "Williams", "Jones",
            "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"
    };

    @Bean
    public CommandLineRunner initTestUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() < 2) { // only admin exists
                log.info("Creating 10 random USER accounts...");

                Random random = new Random();

                IntStream.range(0, 10).forEach(i -> {
                    String firstName = FIRST_NAMES[random.nextInt(FIRST_NAMES.length)];
                    String lastName = LAST_NAMES[random.nextInt(LAST_NAMES.length)];
                    String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + i + "@example.com";

                    if (userRepository.findByEmail(email).isEmpty()) {
                        UserEntity user = new UserEntity();
                        user.setFirstName(firstName);
                        user.setLastName(lastName);
                        user.setEmail(email);
                        user.setPhoneNumber("050" + (1000000 + random.nextInt(8999999)));
                        user.setPassword(passwordEncoder.encode("Password@123")); // default password
                        user.setRole(Role.USER);

                        userRepository.save(user);
                        log.info("Created user: {} {}", firstName, lastName);
                    }
                });
            } else {
                log.info("Users already exist. Skipping random user creation.");
            }
        };
    }
}
