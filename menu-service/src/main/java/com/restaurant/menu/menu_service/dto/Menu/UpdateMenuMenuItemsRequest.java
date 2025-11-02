package com.restaurant.menu.menu_service.dto.Menu;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.Set;

/**
 * Request DTO for updating menu items assigned to menus.
 * Format: Map of menuId -> Set of menuItemIds (no duplicates allowed)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMenuMenuItemsRequest {
    
    /**
     * Map where key is menu ID and value is set of menu item IDs assigned to that menu.
     * Using Set ensures no duplicate menu item IDs per menu.
     * Example: { "1": [3, 4, 12], "2": [5, 6] }
     */
    @NotNull(message = "Assignments map is required")
    private Map<Long, Set<Long>> assignments;
}

