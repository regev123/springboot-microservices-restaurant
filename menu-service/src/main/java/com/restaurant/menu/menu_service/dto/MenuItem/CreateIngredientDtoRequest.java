package com.restaurant.menu.menu_service.dto.MenuItem;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating an ingredient associated with a menu item.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateIngredientDtoRequest {

    /** Ingredient name. */
    @NotBlank(message = "Ingredient name is required")
    private String name;

    /** Whether the ingredient can be removed by the customer. */
    @NotNull(message = "Removable flag is required")
    private Boolean removable;
}
