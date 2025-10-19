package com.restaurant.menu.menu_service.dto.Category;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating category order
 * Contains the category ID and its new order position
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderDtoRequest {
    
    @NotNull(message = "Category ID cannot be null")
    @Positive(message = "Category ID must be a positive number")
    private Long id;
    
    @NotNull(message = "New order cannot be null")
    @Positive(message = "New order must be a positive number")
    private Integer newOrder;
}
