package com.restaurant.menu.menu_service.dto.Menu;

import com.restaurant.menu.menu_service.entity.MenuStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing menu.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMenuDtoRequest {
    /** Identifier of the menu to update. */
    @NotNull(message = "Category ID is required")
    @Min(value = 1, message = "Category ID must be greater than 0")
    private Long id;

    /** Updated menu name. */
    @NotBlank(message = "Menu name is required")
    @Size(min = 2, max = 50, message = "Menu name must be between 2 and 50 characters")
    private String name;
}
