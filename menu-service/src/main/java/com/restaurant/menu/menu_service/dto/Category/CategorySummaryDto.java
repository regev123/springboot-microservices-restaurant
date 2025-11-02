package com.restaurant.menu.menu_service.dto.Category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Summary DTO for category information in menu items.
 * Contains only essential fields needed for menu item display and filtering.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategorySummaryDto {
    /** Category identifier. */
    private Long id;
    /** Category name. */
    private String name;
}
