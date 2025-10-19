package com.restaurant.menu.menu_service.dto.MenuItem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private boolean isAvailable;
    /** Associated category identifier. */
    private Long categoryId;
    /** Associated category name. */
    private String categoryName;
    /** Last update timestamp. */
    private LocalDateTime updatedAt;
}

