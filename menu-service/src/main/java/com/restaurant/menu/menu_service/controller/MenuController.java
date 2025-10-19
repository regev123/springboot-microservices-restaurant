package com.restaurant.menu.menu_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.menu.menu_service.dto.Menu.CreateMenuDtoRequest;
import com.restaurant.menu.menu_service.dto.Menu.MenuDtoResponse;
import com.restaurant.menu.menu_service.dto.Menu.StatusDtoResponse;
import com.restaurant.menu.menu_service.dto.Menu.UpdateMenuDtoRequest;
import com.restaurant.menu.menu_service.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
/**
 * REST controller exposing endpoints for managing menus.
 * Follows Single Responsibility Principle by handling only menu-related HTTP operations.
 * Uses aspect-oriented authorization to eliminate code duplication.
 */
public class MenuController {

    private final MenuService menuService;

    // ---------------------------------------------------------------------
    // Endpoint: Create Menu (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Create a new menu. Admin only.
     *
     * @param request menu creation payload
     * @return the created menu
     */
    @PostMapping("/admin/create")
    @RequiresRole("ADMIN")
    public ResponseEntity<MenuDtoResponse> createMenu(@Valid @RequestBody CreateMenuDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(menuService.createMenu(request.getName()));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Delete Menu (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Delete a menu by ID. Admin only.
     */
    @DeleteMapping("/admin/delete/{menuId}")
    @RequiresRole("ADMIN")
    public ResponseEntity<MenuDtoResponse> deleteMenu(@PathVariable("menuId") Long menuId) {
        menuService.deleteMenu(menuId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Menu (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Update an existing menu. Admin only.
     *
     * @param request menu update payload
     * @return no content
     */
    @PutMapping("/admin/update")
    @RequiresRole("ADMIN")
    public ResponseEntity<Void> updateMenu(@Valid @RequestBody UpdateMenuDtoRequest request) {
        menuService.updateMenu(request.getId(), request.getName());
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: Activate Menu (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Activate a menu by ID (deactivates any existing active menu). Admin only.
     */
    @PutMapping("/admin/{menuId}/activate")
    @RequiresRole("ADMIN")
    public ResponseEntity<List<MenuDtoResponse>> activateMenu(@PathVariable("menuId") Long menuId) {
        return ResponseEntity.ok(menuService.activateMenu(menuId));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Active Menu (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * Get the current active menu.
     */
    @GetMapping("/active")
    public ResponseEntity<MenuDtoResponse> getActiveMenu() {
        return ResponseEntity.ok(menuService.getActiveMenu());
    }

    // ---------------------------------------------------------------------
    // Endpoint: List All Menus (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * List all menus. Admin only.
     */
    @GetMapping("/all")
    @RequiresRole("ADMIN")
    public ResponseEntity<List<MenuDtoResponse>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    // ---------------------------------------------------------------------
    // Endpoint: List All Statuses (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * List all possible menu statuses. Admin only.
     */
    @GetMapping("/status")
    @RequiresRole("ADMIN")
    public ResponseEntity<List<StatusDtoResponse>> getAllStatuses() {
        return ResponseEntity.ok(menuService.getAllStatuses());
    }
}

