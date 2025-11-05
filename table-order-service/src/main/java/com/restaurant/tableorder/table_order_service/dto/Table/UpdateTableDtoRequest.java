package com.restaurant.tableorder.table_order_service.dto.Table;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing table.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTableDtoRequest {
    
    /** Table identifier. */
    @NotNull(message = "Table ID is required")
    @Positive(message = "Table ID must be a positive number")
    private Long id;
    
    /** Updated capacity. */
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
    /** Updated location/zone description. */
    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;
    
    /** Updated active status. */
    private Boolean isActive;
}

