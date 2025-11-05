package com.restaurant.tableorder.table_order_service.dto.Table;

import com.restaurant.tableorder.table_order_service.entity.TableStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for changing table status.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeTableStatusDtoRequest {
    
    /** Table identifier. */
    @NotNull(message = "Table ID is required")
    @Positive(message = "Table ID must be a positive number")
    private Long tableId;
    
    /** New table status. */
    @NotNull(message = "Status is required")
    private TableStatus status;
}

