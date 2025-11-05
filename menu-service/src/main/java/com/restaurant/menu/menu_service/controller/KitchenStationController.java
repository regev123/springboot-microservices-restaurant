package com.restaurant.menu.menu_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.menu.menu_service.dto.KitchenStation.CreateKitchenStationDtoRequest;
import com.restaurant.menu.menu_service.dto.KitchenStation.KitchenStationDto;
import com.restaurant.menu.menu_service.dto.KitchenStation.UpdateKitchenStationDtoRequest;
import com.restaurant.menu.menu_service.dto.KitchenStation.UpdateKitchenStationMenuItemsRequest;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.service.KitchenStationService;
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
@RequestMapping("/menu/kitchen-stations")
@RequiredArgsConstructor
@Tag(name = "Kitchen Station Management", description = "Endpoints for managing kitchen stations. Admin operations require ADMIN role.")
@SecurityRequirement(name = "Bearer Authentication")
/**
 * REST controller exposing endpoints for managing kitchen stations.
 * Follows Single Responsibility Principle by handling only kitchen station-related HTTP operations.
 * Uses aspect-oriented authorization to eliminate code duplication.
 */
public class KitchenStationController {

    private final KitchenStationService kitchenStationService;

    // ---------------------------------------------------------------------
    // Endpoint: Create Kitchen Station (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Create a new kitchen station. Admin only.
     */
    @PostMapping("/admin/create")
    @RequiresRole("ADMIN")
    @Operation(summary = "Create kitchen station", description = "Creates a new kitchen station. Requires ADMIN role.")
    public ResponseEntity<KitchenStationDto> createKitchenStation(@Valid @RequestBody CreateKitchenStationDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kitchenStationService.createKitchenStation(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Kitchen Station (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Update an existing kitchen station by ID. Admin only.
     */
    @PutMapping("/admin/update")
    @RequiresRole("ADMIN")
    @Operation(summary = "Update kitchen station", description = "Updates an existing kitchen station by ID. Requires ADMIN role.")
    public ResponseEntity<KitchenStationDto> updateKitchenStation(
            @Valid @RequestBody UpdateKitchenStationDtoRequest request
    ) {
        return ResponseEntity.ok(kitchenStationService.updateKitchenStation(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Delete Kitchen Station (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Delete a kitchen station by ID. Admin only.
     */
    @DeleteMapping("/admin/delete/{stationId}")
    @RequiresRole("ADMIN")
    @Operation(summary = "Delete kitchen station", description = "Deletes a kitchen station by ID. Requires ADMIN role.")
    public ResponseEntity<Void> deleteKitchenStation(@PathVariable("stationId") Long stationId) {
        kitchenStationService.deleteKitchenStation(stationId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: List All Kitchen Stations (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * List all kitchen stations.
     */
    @GetMapping("/all")
    @Operation(summary = "List all kitchen stations", description = "Lists all kitchen stations. Public endpoint.")
    public ResponseEntity<List<KitchenStationDto>> getAllKitchenStations() {
        return ResponseEntity.ok(kitchenStationService.getAllKitchenStations());
    }

    // ---------------------------------------------------------------------
    // Endpoint: List Active Kitchen Stations (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * List only active kitchen stations ordered by sort order.
     */
    @GetMapping("/active")
    @Operation(summary = "List active kitchen stations", description = "Lists only active kitchen stations ordered by sort order. Public endpoint.")
    public ResponseEntity<List<KitchenStationDto>> getActiveKitchenStations() {
        return ResponseEntity.ok(kitchenStationService.getActiveKitchenStations());
    }

    // ---------------------------------------------------------------------
    // Endpoint: List Active Stations with Menu Items (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * List active kitchen stations that have menu items assigned to them.
     */
    @GetMapping("/active-with-items")
    @Operation(summary = "List active stations with menu items", description = "Lists active kitchen stations that have menu items assigned to them. Public endpoint.")
    public ResponseEntity<List<KitchenStationDto>> getActiveStationsWithMenuItems() {
        return ResponseEntity.ok(kitchenStationService.getActiveStationsWithMenuItems());
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Kitchen Station by ID (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * Get a single kitchen station by ID.
     */
    @GetMapping("/{stationId}")
    @Operation(summary = "Get kitchen station by ID", description = "Gets a single kitchen station by ID. Public endpoint.")
    public ResponseEntity<KitchenStationDto> getKitchenStationById(@PathVariable("stationId") Long stationId) {
        return ResponseEntity.ok(kitchenStationService.getKitchenStationById(stationId));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Kitchen Station's Menu Items (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * Get menu items assigned to a specific kitchen station by ID.
     */
    @GetMapping("/{stationId}/menu-items")
    @Operation(summary = "Get menu items by station ID", description = "Gets menu items assigned to a specific kitchen station by ID. Public endpoint.")
    public ResponseEntity<List<MenuItemDto>> getKitchenStationMenuItems(@PathVariable("stationId") Long stationId) {
        return ResponseEntity.ok(kitchenStationService.getMenuItemsByStationId(stationId));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Kitchen Station Menu Items Assignments (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Batch update menu items assigned to kitchen stations.
     * Accepts a map of stationId -> List of menuItemIds.
     * Example: { "1": [3, 4, 12], "2": [5, 6] }
     */
    @PutMapping("/admin/update-menu-items")
    @RequiresRole("ADMIN")
    @Operation(summary = "Update kitchen station menu items assignments", description = "Batch updates menu items assigned to kitchen stations. Accepts a map of stationId -> List of menuItemIds. Requires ADMIN role.")
    public ResponseEntity<List<KitchenStationDto>> updateKitchenStationMenuItems(
            @Valid @RequestBody UpdateKitchenStationMenuItemsRequest request
    ) {
        return ResponseEntity.ok(kitchenStationService.updateKitchenStationMenuItems(request));
    }
}
