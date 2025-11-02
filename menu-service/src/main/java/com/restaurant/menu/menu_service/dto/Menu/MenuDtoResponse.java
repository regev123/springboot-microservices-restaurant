package com.restaurant.menu.menu_service.dto.Menu;

import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.entity.MenuStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO representing a menu resource.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuDtoResponse {
    /** Menu identifier. */
    private Long id;
    /** Menu name. */
    private String name;
    /** Current status of the menu. */
    private MenuStatus status;
    /** Creation timestamp. */
    private LocalDateTime createdAt;
    /** Last update timestamp. */
    private LocalDateTime updatedAt;
    /** List of menu items assigned to this menu. */
    private List<MenuItemDto> menuItems;
}

