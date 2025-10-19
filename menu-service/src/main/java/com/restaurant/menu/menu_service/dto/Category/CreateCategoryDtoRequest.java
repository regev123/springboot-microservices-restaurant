package com.restaurant.menu.menu_service.dto.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new category.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCategoryDtoRequest {

    /** Category name. */
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    private String name;

    /** Category description. */
    @Size(max = 500, message = "Category description cannot exceed 500 characters")
    private String description;
}
