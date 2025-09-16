package com.restaurant.auth.auth_service.config;

import com.restaurant.auth.auth_service.entity.Role;
import com.restaurant.auth.auth_service.entity.UserEntity;
import com.restaurant.auth.auth_service.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Initializes the system with a default admin user at application startup.
 *
 * <p>
 * This configuration class ensures that an admin account exists in the database.
 * If no admin is found, it creates one using credentials provided via environment
 * variables or application properties.
 * </p>
 */
@Configuration
@Slf4j
public class AdminInitializer {

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    /**
     * CommandLineRunner bean that runs during application startup.
     *
     * <p>
     * This method checks if an admin user already exists in the system.
     * If not, it creates a new admin user with predefined credentials.
     * </p>
     *
     * @param userRepository   the repository used to access and save users
     * @param passwordEncoder  used to securely encode the admin password
     * @return a CommandLineRunner instance to execute during startup
     */
    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                createDefaultAdmin(userRepository, passwordEncoder);
            } else {
                log.info("Admin user already exists. Skipping creation.");
            }
        };
    }

    /**
     * Creates and saves the default admin user.
     *
     * @param userRepository   the repository used to save the admin user
     * @param passwordEncoder  used to securely hash the password
     */
    private void createDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        UserEntity admin = new UserEntity();
        admin.setEmail(adminEmail);
        admin.setFirstName("System");
        admin.setLastName("Admin");
        admin.setPhoneNumber("0500000000");
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);

        userRepository.save(admin);

        log.info("Admin user created with email: {}", adminEmail);
        log.warn("Default password should be changed immediately!");
    }
}
