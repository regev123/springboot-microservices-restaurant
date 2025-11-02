package com.restaurant.menu.menu_service.dto.KitchenStation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing kitchen station.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateKitchenStationDtoRequest {
    @NotNull(message = "Station ID is required")
    private Long id;
    
    @NotBlank(message = "Station name is required")
    @Size(max = 100, message = "Station name must not exceed 100 characters")
    private String name;
    
    @NotNull(message = "IsActive flag is required")
    private Boolean isActive;
}
