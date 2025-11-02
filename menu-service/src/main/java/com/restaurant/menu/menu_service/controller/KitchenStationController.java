package com.restaurant.menu.menu_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.menu.menu_service.dto.KitchenStation.CreateKitchenStationDtoRequest;
import com.restaurant.menu.menu_service.dto.KitchenStation.KitchenStationDto;
import com.restaurant.menu.menu_service.dto.KitchenStation.UpdateKitchenStationDtoRequest;
import com.restaurant.menu.menu_service.dto.KitchenStation.UpdateKitchenStationMenuItemsRequest;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.service.KitchenStationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu/kitchen-stations")
@RequiredArgsConstructor
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
    public ResponseEntity<List<KitchenStationDto>> updateKitchenStationMenuItems(
            @Valid @RequestBody UpdateKitchenStationMenuItemsRequest request
    ) {
        return ResponseEntity.ok(kitchenStationService.updateKitchenStationMenuItems(request));
    }
}
