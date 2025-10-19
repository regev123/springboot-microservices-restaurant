package com.restaurant.menu.menu_service.dto.MenuItem;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO for creating a new menu item with optional ingredients.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMenuItemDtoRequest {

    /** Identifier of the menu the item belongs to. */
    @NotNull(message = "Menu ID is required")
    private Long menuId;

    /** Identifier of the category the item belongs to. */
    @NotNull(message = "Category ID is required")
    private Long categoryId;

    /** Item name. */
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot be longer than 100 characters")
    private String name;

    /** Optional item description. */
    @Size(max = 255, message = "Description cannot be longer than 255 characters")
    private String description;

    /** Item price. Must be greater than zero. */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    /** Optional list of ingredient definitions. */
    @Valid
    private List<CreateIngredientDtoRequest> ingredients;
}
