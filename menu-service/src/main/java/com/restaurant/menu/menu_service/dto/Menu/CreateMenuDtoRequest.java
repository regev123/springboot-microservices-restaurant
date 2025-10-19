package com.restaurant.menu.menu_service.dto.Menu;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new menu.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateMenuDtoRequest {
    /** Menu name. */
    @NotBlank(message = "Menu name is required")
    @Size(min = 2, max = 50, message = "Menu name must be between 2 and 50 characters")
    private String name;
}
