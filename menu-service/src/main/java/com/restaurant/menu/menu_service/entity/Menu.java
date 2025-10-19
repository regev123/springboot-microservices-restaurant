package com.restaurant.menu.menu_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "menus",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"name"})
        }
)
@Data
/**
 * JPA entity representing a menu with status and audit timestamps.
 */
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private MenuStatus status = MenuStatus.DRAFT; // ACTIVE, DRAFT, ARCHIVED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}

