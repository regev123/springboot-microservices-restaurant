package com.restaurant.menu.menu_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

/**
 * Embedded ingredient class for menu items.
 * Ingredients are part of the MenuItem aggregate and don't have independent lifecycle.
 */
@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ingredient {
    
    /** Ingredient name. */
    @Column(nullable = false)
    @NotBlank(message = "Ingredient name is required")
    @Size(min = 2, max = 50, message = "Ingredient name must be between 2 and 50 characters")
    private String name;
    
    /** Whether this ingredient can be removed from the menu item. */
    @Column(nullable = false)
    private boolean removable;
    
    /**
     * Equals method based on ingredient name only.
     * This ensures Set uniqueness is based on ingredient name.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Ingredient that = (Ingredient) o;
        return Objects.equals(name, that.name);
    }
    
    /**
     * HashCode method based on ingredient name only.
     * This ensures Set uniqueness is based on ingredient name.
     */
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}