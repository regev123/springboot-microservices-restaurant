package com.restaurant.menu.menu_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.menu.menu_service.dto.MenuItem.CreateMenuItemDtoRequest;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.dto.UpdateMenuItemRequest;
import com.restaurant.menu.menu_service.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu/items")
@RequiredArgsConstructor
@Tag(name = "Menu Item Management", description = "Endpoints for managing menu items. Admin operations require ADMIN role.")
@SecurityRequirement(name = "Bearer Authentication")
/**
 * REST controller exposing endpoints for creating, updating, deleting, and querying menu items.
 * Follows Single Responsibility Principle by handling only menu item-related HTTP operations.
 * Uses aspect-oriented authorization to eliminate code duplication.
 */
public class MenuItemController {

    private final MenuItemService menuItemService;


    // ---------------------------------------------------------------------
    // Endpoint: Create Menu Item (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Create a new menu item. Admin only.
     */
    @PostMapping("/admin/create")
    @RequiresRole("ADMIN")
    @Operation(summary = "Create menu item", description = "Creates a new menu item. Requires ADMIN role.")
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody CreateMenuItemDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuItemService.createMenuItem(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Menu Item (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Update an existing menu item by ID. Admin only.
     */
    @PutMapping("/admin/update")
    @RequiresRole("ADMIN")
    @Operation(summary = "Update menu item", description = "Updates an existing menu item by ID. Requires ADMIN role.")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @Valid @RequestBody UpdateMenuItemRequest request
    ) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Delete Menu Item (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Delete a menu item by ID. Admin only.
     */
    @DeleteMapping("/admin/delete/{itemId}")
    @RequiresRole("ADMIN")
    @Operation(summary = "Delete menu item", description = "Deletes a menu item by ID. Requires ADMIN role.")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable("itemId") Long itemId) {
        menuItemService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: List Menu Items (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * List menu items with optional filters for category and availability.
     */
    @GetMapping("/all")
    @Operation(summary = "List all menu items", description = "Lists all menu items with optional filters for category and availability. Public endpoint.")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getMenuItems());
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Menu Item by ID (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * Get a single menu item by ID.
     */
    @GetMapping("/{itemId}")
    @Operation(summary = "Get menu item by ID", description = "Gets a single menu item by ID. Public endpoint.")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable("itemId") Long itemId) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(itemId));
    }
}

