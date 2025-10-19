package com.restaurant.menu.menu_service.dto.Category;

import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO representing a menu category returned by the Menu Service.
 * <p>
 * This type is used to transfer category data to API clients (e.g., via REST
 * controllers) and is typically serialized to JSON.
 * </p>
 * <p>
 * Lombok annotations:
 * <ul>
 *   <li>{@code @Data} generates getters, setters, {@code equals}, {@code hashCode}, and {@code toString}.</li>
 *   <li>{@code @AllArgsConstructor} generates a constructor with all fields.</li>
 *   <li>{@code @NoArgsConstructor} generates a no-argument constructor.</li>
 * </ul>
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDtoResponse {
    /** Unique identifier of the category. */
    private Long id;
    
    /** Human-readable name of the category. */
    private String name;
    
    /** Description of the category. */
    private String description;
    
    /** Sort order for displaying categories. */
    private Integer sortOrder;
    
    /** Timestamp when the category was created. */
    private LocalDateTime createdAt;
    
    /** Timestamp when the category was last updated. */
    private LocalDateTime updatedAt;
    
    /** List of menu items in this category. */
    private List<MenuItemDto> menuItems;
}
