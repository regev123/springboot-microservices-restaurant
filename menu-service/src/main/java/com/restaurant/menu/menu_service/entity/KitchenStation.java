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
@Table(name = "kitchen_stations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
/**
 * JPA entity representing a kitchen station where specific menu items are prepared.
 * Each station is responsible for a subset of menu items to organize kitchen workflow.
 */
public class KitchenStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private Boolean isActive;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "kitchen_station_menu_items",
        joinColumns = @JoinColumn(name = "kitchen_station_id"),
        inverseJoinColumns = @JoinColumn(name = "menu_item_id")
    )
    private List<MenuItem> menuItems;

    @Column(nullable = false)
    private Integer menuItemsCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // JPA Lifecycle callbacks for automatic timestamp and count management
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        menuItems = new ArrayList<>();
        menuItemsCount = 0;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PostLoad
    protected void onLoad() {
        // Automatically calculate count every time we load the entity from database
        if (menuItems != null) {
            menuItemsCount = menuItems.size();
        } else {
            menuItemsCount = 0;
        }
    }
}
