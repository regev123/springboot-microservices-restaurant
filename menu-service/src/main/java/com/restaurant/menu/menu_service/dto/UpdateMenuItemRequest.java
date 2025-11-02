package com.restaurant.menu.menu_service.dto;

import com.restaurant.menu.menu_service.entity.Ingredient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

/**
 * 
 * Request DTO for updating an existing menu item.
 */
@Data
public class UpdateMenuItemRequest {
    /** Item identifier. */
    @NotNull(message = "Item ID is required")
    @Positive(message = "Item ID must be a positive number")
    private Long id;
    
    /** Associated category identifier. */
    @NotNull(message = "Category ID is required")
    @Positive(message = "Category ID must be a positive number")
    private Long categoryId;
    
    /** Updated item name. */
    @NotBlank(message = "Name is required")
    private String name;

    /** Optional updated description. */
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    /** Updated price. Must be greater than zero. */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    /** Updated availability flag. */
    @NotNull(message = "Availability flag is required")
    private Boolean isAvailable;
    
    /** Set of ingredients for this menu item. */
    @Valid
    private Set<Ingredient> ingredients;
}

