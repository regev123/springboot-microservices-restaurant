package com.restaurant.menu.menu_service.dto.MenuItem;

import com.restaurant.menu.menu_service.dto.Category.CategorySummaryDto;
import com.restaurant.menu.menu_service.entity.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Response DTO representing a menu item.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemDto {
    /** Item identifier. */
    private Long id;
    /** Item name. */
    private String name;
    /** Optional item description. */
    private String description;
    /** Price in the restaurant's currency. */
    private BigDecimal price;
    /** Availability flag indicating if the item can be ordered. */
    private Boolean isAvailable;
    /** Associated category information. */
    private CategorySummaryDto category;
    /** Creation timestamp. */
    private LocalDateTime createdAt;
    /** Last update timestamp. */
    private LocalDateTime updatedAt;
    /** Set of ingredients for this menu item. */
    private Set<Ingredient> ingredients;
}
