package com.restaurant.tableorder.table_order_service.dto.Order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request DTO for adding/updating an item in an order.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddOrderItemDtoRequest {
    
    /** Menu item ID. */
    @NotNull(message = "Menu item ID is required")
    @Positive(message = "Menu item ID must be a positive number")
    private Long menuItemId;
    
    /** Menu item name (for reference). */
    @NotNull(message = "Menu item name is required")
    @Size(min = 1, max = 200, message = "Menu item name must be between 1 and 200 characters")
    private String menuItemName;
    
    /** Quantity. */
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    /** Price per item. */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    /** Optional special instructions. */
    @Size(max = 500, message = "Special instructions cannot exceed 500 characters")
    private String specialInstructions;
}

