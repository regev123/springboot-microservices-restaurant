package com.restaurant.menu.menu_service.dto.Menu;

import com.restaurant.menu.menu_service.entity.MenuStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
}

