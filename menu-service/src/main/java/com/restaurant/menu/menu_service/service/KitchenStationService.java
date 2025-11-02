package com.restaurant.menu.menu_service.service;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.KitchenStation.CreateKitchenStationDtoRequest;
import com.restaurant.menu.menu_service.dto.KitchenStation.KitchenStationDto;
import com.restaurant.menu.menu_service.dto.KitchenStation.UpdateKitchenStationDtoRequest;
import com.restaurant.menu.menu_service.dto.KitchenStation.UpdateKitchenStationMenuItemsRequest;
import com.restaurant.menu.menu_service.entity.KitchenStation;
import com.restaurant.menu.menu_service.entity.MenuItem;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.mapper.KitchenStationMapper;
import com.restaurant.menu.menu_service.mapper.MenuItemMapper;
import com.restaurant.menu.menu_service.repository.KitchenStationRepository;
import com.restaurant.menu.menu_service.repository.MenuItemRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
/**
 * Application service encapsulating business logic for managing kitchen stations.
 * Follows Single Responsibility Principle by handling only kitchen station-related business logic.
 * Follows Dependency Inversion Principle by depending on abstractions (repositories and mapper).
 */
public class KitchenStationService {

    // ==================== CONSTANTS ====================
    // Error Messages
    private static final String STATION_NOT_FOUND_MSG = "Kitchen station not found with ID: %s";
    private static final String STATION_NAME_EXISTS_MSG = "Kitchen station with name '%s' already exists";
    
    // ==================== DEPENDENCIES ====================
    private final KitchenStationRepository kitchenStationRepository;
    private final MenuItemRepository menuItemRepository;
    private final KitchenStationMapper kitchenStationMapper;
    private final MenuItemMapper menuItemMapper;

    // ---------------------------------------------------------------------
    // Command: Create Kitchen Station
    // ---------------------------------------------------------------------
    /**
     * Create a new kitchen station.
     */
    public KitchenStationDto createKitchenStation(CreateKitchenStationDtoRequest request) {
        
        // 1. Check if kitchen station with the same name already exists
        if (kitchenStationRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException(String.format(STATION_NAME_EXISTS_MSG, request.getName()));
        }
        
        // 2. Create the kitchen station entity using Builder pattern
        KitchenStation kitchenStation = KitchenStation.builder()
                .name(request.getName())
                .isActive(request.getIsActive())
                .build();

        // 3. Save and return
        KitchenStation savedStation = kitchenStationRepository.save(kitchenStation);
        return kitchenStationMapper.toDto(savedStation);
    }

    // ---------------------------------------------------------------------
    // Command: Update Kitchen Station
    // ---------------------------------------------------------------------
    /**
     * Update an existing kitchen station.
     */
    public KitchenStationDto updateKitchenStation(UpdateKitchenStationDtoRequest request) {
        Long stationId = request.getId();
        KitchenStation station = kitchenStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(STATION_NOT_FOUND_MSG, stationId)));

        // Check if another kitchen station with the same name already exists (excluding current station)
        if (kitchenStationRepository.existsByNameIgnoreCaseAndIdNot(request.getName(), stationId)) {
            throw new IllegalArgumentException(String.format(STATION_NAME_EXISTS_MSG, request.getName()));
        }

        station.setName(request.getName());
        station.setIsActive(request.getIsActive());
        station.setUpdatedAt(LocalDateTime.now());
        // menuItemsCount will be automatically updated by @PostUpdate callback

        KitchenStation savedStation = kitchenStationRepository.save(station);
        return kitchenStationMapper.toDto(savedStation);
    }

    // ---------------------------------------------------------------------
    // Command: Delete Kitchen Station
    // ---------------------------------------------------------------------
    /**
     * Delete a kitchen station by ID.
     * Note: This will set kitchen station to null for all assigned menu items.
     */
    public void deleteKitchenStation(Long stationId) {
        KitchenStation station = kitchenStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(STATION_NOT_FOUND_MSG, stationId)));
        
        // Clear kitchen station assignment from all menu items
        station.getMenuItems().forEach(menuItem -> menuItem.getKitchenStations().remove(station));
        
        kitchenStationRepository.deleteById(stationId);
    }

    // ---------------------------------------------------------------------
    // Query: Get Kitchen Station by ID
    // ---------------------------------------------------------------------
    /**
     * Get a single kitchen station by ID.
     */
    public KitchenStationDto getKitchenStationById(Long stationId) {
        return kitchenStationRepository.findById(stationId)
                .map(kitchenStationMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(STATION_NOT_FOUND_MSG, stationId)));
    }

    // ---------------------------------------------------------------------
    // Query: List Kitchen Stations
    // ---------------------------------------------------------------------
    /**
     * List all kitchen stations.
     */
    public List<KitchenStationDto> getAllKitchenStations() {
        return kitchenStationRepository.findAll().stream()
                .map(kitchenStationMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * List only active kitchen stations ordered by sort order.
     */
    public List<KitchenStationDto> getActiveKitchenStations() {
        return kitchenStationRepository.findByIsActiveTrue().stream()
                .map(kitchenStationMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * List active kitchen stations that have menu items assigned to them.
     */
    
    public List<KitchenStationDto> getActiveStationsWithMenuItems() {
        return kitchenStationRepository.findActiveStationsWithMenuItems().stream()
                .map(kitchenStationMapper::toDto)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // Command: Update Kitchen Station Menu Items Assignments
    // ---------------------------------------------------------------------
    /**
     * Batch update menu items assigned to kitchen stations.
     * Accepts a map of stationId -> Set of menuItemIds (no duplicates allowed) and updates all assignments.
     */
    public List<KitchenStationDto> updateKitchenStationMenuItems(UpdateKitchenStationMenuItemsRequest request) {
        // 1. Get all station IDs and collect all unique menu item IDs
        log.info("Updating kitchen station menu items assignments: {}", request.getAssignments());
        Set<Long> stationIds = request.getAssignments().keySet();
        Set<Long> allMenuItemIds = request.getAssignments().values().stream()
                .flatMap(Set::stream)
                .collect(Collectors.toSet());
        
        // 2. Load all stations (simple - just by ID
        List<KitchenStation> stations = kitchenStationRepository.findAllById(stationIds);
        if (stations.size() != stationIds.size()) {
            throw new ResourceNotFoundException("One or more kitchen stations not found");
        }
        
        // 3. Load all menu items that will be assigned
        List<MenuItem> menuItems = menuItemRepository.findAllById(allMenuItemIds);
        if (menuItems.size() != allMenuItemIds.size()) {
            throw new ResourceNotFoundException("One or more menu items not found");
        }
        
        // 4. Create a map for quick lookup by ID
        Map<Long, MenuItem> menuItemMap = menuItems.stream()
                .collect(Collectors.toMap(MenuItem::getId, item -> item));
        
        // 5. For each station: delete all existing assignments, then assign new ones
        for (Map.Entry<Long, Set<Long>> entry : request.getAssignments().entrySet()) {
            Long stationId = entry.getKey();
            Set<Long> menuItemIds = entry.getValue();
            
            // Find the station
            KitchenStation station = stations.stream()
                    .filter(s -> s.getId().equals(stationId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException(String.format(STATION_NOT_FOUND_MSG, stationId)));
            
            // Initialize menuItems if null
            if (station.getMenuItems() == null) {
                station.setMenuItems(new ArrayList<>());
            }
            
            // Clear all existing menu items (this deletes from join table)
            // Remove bidirectional relationships
            station.getMenuItems().forEach(menuItem -> {
                if (menuItem.getKitchenStations() != null) {
                    menuItem.getKitchenStations().remove(station);
                }
            });
            
            // Assign new menu items (this inserts into join table)
            List<MenuItem> newMenuItems = new ArrayList<>();
            for (Long menuItemId : menuItemIds) {
                MenuItem menuItem = menuItemMap.get(menuItemId);
                if (menuItem != null) {
                    newMenuItems.add(menuItem);
                    // Update bidirectional relationship
                    if (menuItem.getKitchenStations() == null) {
                        menuItem.setKitchenStations(new ArrayList<>());
                    }
                    if (!menuItem.getKitchenStations().contains(station)) {
                        menuItem.getKitchenStations().add(station);
                    }
                }
            }
            station.setMenuItems(newMenuItems);
            
            // Save immediately to ensure changes are persisted
            kitchenStationRepository.saveAndFlush(station);
        }
        
        // Reload all updated stations with their menu items for DTO mapping
        List<KitchenStation> savedStations = kitchenStationRepository.findAllWithMenuItems().stream()
                .filter(station -> request.getAssignments().keySet().contains(station.getId()))
                .collect(Collectors.toList());

        // Return updated station DTOs with menu items
        return savedStations.stream()
                .map(kitchenStationMapper::toDtoWithMenuItems)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // Query: Get Menu Items by Station ID
    // ---------------------------------------------------------------------
    /**
     * Get menu items assigned to a specific kitchen station as DTOs.
     */
    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuItemsByStationId(Long stationId) {
        // Verify station exists
        KitchenStation station = kitchenStationRepository.findById(stationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(STATION_NOT_FOUND_MSG, stationId)));
        if (station.getMenuItems() == null) {
            return new ArrayList<>();
        }
        return station.getMenuItems().stream()
                .map(menuItemMapper::toDto)
                .collect(Collectors.toList());
    }
}
