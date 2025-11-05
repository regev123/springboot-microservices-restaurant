package com.restaurant.tableorder.table_order_service.dto.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO representing an order item.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto {
    /** Order item identifier. */
    private Long id;
    
    /** Menu item ID. */
    private Long menuItemId;
    
    /** Menu item name. */
    private String menuItemName;
    
    /** Quantity. */
    private Integer quantity;
    
    /** Price per item. */
    private BigDecimal price;
    
    /** Special instructions. */
    private String specialInstructions;
    
    /** Creation timestamp. */
    private LocalDateTime createdAt;
    
    /** Last update timestamp. */
    private LocalDateTime updatedAt;
}

