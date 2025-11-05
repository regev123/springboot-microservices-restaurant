package com.restaurant.menu.menu_service.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Entity
@Table(name = "menu_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
/**
 * JPA entity representing an item within a menu.
 */
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(mappedBy = "menuItems")
    private List<Menu> menus;

    @ManyToMany(mappedBy = "menuItems")
    private List<KitchenStation> kitchenStations;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Boolean isAvailable;

    @ElementCollection
    @CollectionTable(
            name = "menu_item_ingredients",
            joinColumns = @JoinColumn(name = "menu_item_id")
    )
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "ingredient_name")),
            @AttributeOverride(name = "removable", column = @Column(name = "is_removable"))
    })
    private Set<Ingredient> ingredients;

    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    // JPA Lifecycle callbacks for automatic timestamp management
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        // Only initialize collections if they are null to avoid overwriting existing values
        // This is critical for @ElementCollection - if ingredients are set via builder, don't overwrite them
        if (ingredients == null) {
            ingredients = new HashSet<>();
        }
        if (menus == null) {
            menus = new ArrayList<>();
        }
        if (kitchenStations == null) {
            kitchenStations = new ArrayList<>();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

