package com.restaurant.menu.menu_service.dto.MenuItem;

import com.restaurant.menu.menu_service.entity.Ingredient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

/**
 * Request DTO for creating a menu item.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateMenuItemDtoRequest {
    
    /** Associated category identifier. */
    @NotNull(message = "Category ID is required")
    @Positive(message = "Category ID must be a positive number")
    private Long categoryId;
    
    /** Item name. */
    @NotBlank(message = "Menu Item name is required")
    @Size(min = 2, max = 100, message = "Menu Item name must be between 2 and 100 characters")
    private String name;    
    
    /** Optional item description. */
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    /** Price in the restaurant's currency. */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "999.99", message = "Price cannot exceed 999.99")
    private BigDecimal price;
    
    /** Availability flag indicating if the item can be ordered. */
    @NotNull(message = "Availability flag is required")
    private Boolean isAvailable;
    
    /** Set of ingredients for this menu item. */
    @Valid
    private Set<Ingredient> ingredients;
}