package com.restaurant.menu.menu_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "menus",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"name"})
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private MenuStatus status; // ACTIVE, DRAFT, ARCHIVED

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "menu_menu_items",
        joinColumns = @JoinColumn(name = "menu_id"),
        inverseJoinColumns = @JoinColumn(name = "menu_item_id")
    )
    private List<MenuItem> menuItems;

    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    // JPA Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        status = MenuStatus.DRAFT;
        menuItems = new ArrayList<>();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

