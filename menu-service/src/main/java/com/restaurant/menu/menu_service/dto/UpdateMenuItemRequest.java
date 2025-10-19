package com.restaurant.menu.menu_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 
 * Request DTO for updating an existing menu item.
 */
@Data
public class UpdateMenuItemRequest {
    /** Updated item name. */
    @NotBlank(message = "Name is required")
    private String name;

    /** Optional updated description. */
    private String description;

    /** Updated price. Must be greater than zero. */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    /** Updated availability flag. */
    private boolean isAvailable;

    /** Optional category change. */
    private Long categoryId;
}

