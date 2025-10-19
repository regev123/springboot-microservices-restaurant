package com.restaurant.menu.menu_service.dto.Category;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for deleting a category by ID.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeleteCategoryDtoRequest {

    /** Identifier of the category to delete. */
    @NotNull(message = "Category ID is required")
    @Min(value = 1, message = "Category ID must be greater than 0")
    private Long id;
}
