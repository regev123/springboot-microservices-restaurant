package com.restaurant.tableorder.table_order_service.dto.Table;

import com.restaurant.tableorder.table_order_service.dto.Order.OrderDtoResponse;
import com.restaurant.tableorder.table_order_service.entity.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO representing a table.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableDtoResponse {
    /** Table identifier. */
    private Long id;
    
    /** Table number. */
    private Integer tableNumber;
    
    /** Maximum capacity. */
    private Integer capacity;
    
    /** Current status. */
    private TableStatus status;
    
    /** Location/zone description. */
    private String location;
    
    /** Whether the table is active. */
    private Boolean isActive;
    
    /** List of orders associated with this table (loaded on demand). */
    private List<OrderDtoResponse> orders;
    
    /** Creation timestamp. */
    private LocalDateTime createdAt;
    
    /** Last update timestamp. */
    private LocalDateTime updatedAt;
}

