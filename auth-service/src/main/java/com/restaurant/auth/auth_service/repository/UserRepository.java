package com.restaurant.auth.auth_service.repository;

import com.restaurant.auth.auth_service.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing {@link UserEntity} persistence.
 * Extends {@link JpaRepository} to provide CRUD and query methods.
 */
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    /**
     * Finds a user by their email address.
     *
     * @param email the email to search for
     * @return an {@link Optional} containing the user if found, or empty if not
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Retrieves all users except the one with the specified email.
     *
     * @param email the email to exclude
     * @return list of users excluding the user with the given email
     */
    List<UserEntity> findByEmailNot(String email);
}
