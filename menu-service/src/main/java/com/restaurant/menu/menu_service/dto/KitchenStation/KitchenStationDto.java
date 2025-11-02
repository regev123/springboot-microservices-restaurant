package com.restaurant.menu.menu_service.dto.KitchenStation;

import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO representing a kitchen station.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class KitchenStationDto {
    /** Station identifier. */
    private Long id;
    /** Station name. */
    private String name;
    /** Whether the station is active. */
    private Boolean isActive;
    /** List of menu items assigned to this station. */
    private List<MenuItemDto> menuItems;
    /** Number of menu items assigned to this station. */
    private Integer menuItemsCount;
    /** Creation timestamp. */
    private LocalDateTime createdAt;
    /** Last update timestamp. */
    private LocalDateTime updatedAt;
}
