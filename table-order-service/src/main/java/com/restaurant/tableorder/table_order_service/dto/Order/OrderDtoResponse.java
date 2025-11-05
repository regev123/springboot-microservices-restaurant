package com.restaurant.tableorder.table_order_service.dto.Order;

import com.restaurant.tableorder.table_order_service.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO representing an order.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDtoResponse {
    /** Order identifier. */
    private Long id;
    
    /** Associated table ID. */
    private Long tableId;
    
    /** Table number. */
    private Integer tableNumber;
    
    /** Waitress user ID. */
    private Long waitressId;
    
    /** Current order status. */
    private OrderStatus status;
    
    /** Total amount for the order. */
    private BigDecimal totalAmount;
    
    /** List of order items. */
    private List<OrderItemDto> orderItems;
    
    /** Creation timestamp. */
    private LocalDateTime createdAt;
    
    /** Approval timestamp. */
    private LocalDateTime approvedAt;
    
    /** Sent to kitchen timestamp. */
    private LocalDateTime sentToKitchenAt;
}

