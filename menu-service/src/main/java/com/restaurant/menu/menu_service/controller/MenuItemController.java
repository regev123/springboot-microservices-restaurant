package com.restaurant.menu.menu_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.menu.menu_service.dto.MenuItem.CreateMenuItemDtoRequest;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.dto.UpdateMenuItemRequest;
import com.restaurant.menu.menu_service.service.MenuItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu/items")
@RequiredArgsConstructor
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
    @PostMapping
    @RequiresRole("ADMIN")
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody CreateMenuItemDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuItemService.createMenuItem(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Menu Item (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Update an existing menu item by ID. Admin only.
     */
    @PutMapping("/{itemId}")
    @RequiresRole("ADMIN")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateMenuItemRequest request
    ) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(itemId, request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Delete Menu Item (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Delete a menu item by ID. Admin only.
     */
    @DeleteMapping("/{itemId}")
    @RequiresRole("ADMIN")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long itemId) {
        menuItemService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: List Menu Items (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * List menu items with optional filters for category and availability.
     */
    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean available
    ) {
        return ResponseEntity.ok(menuItemService.getMenuItems(categoryId, available));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Menu Item by ID (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * Get a single menu item by ID.
     */
    @GetMapping("/{itemId}")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long itemId) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(itemId));
    }
}

