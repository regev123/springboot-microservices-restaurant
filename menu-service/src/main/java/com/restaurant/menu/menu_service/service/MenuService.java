package com.restaurant.menu.menu_service.service;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.Menu.MenuDtoResponse;
import com.restaurant.menu.menu_service.dto.Menu.StatusDtoResponse;
import com.restaurant.menu.menu_service.dto.Menu.UpdateMenuMenuItemsRequest;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuItem;
import com.restaurant.menu.menu_service.entity.MenuStatus;
import com.restaurant.menu.menu_service.exceptions.MenuAlreadyExistException;
import com.restaurant.menu.menu_service.mapper.MenuItemMapper;
import com.restaurant.menu.menu_service.mapper.MenuMapper;
import com.restaurant.menu.menu_service.repository.MenuItemRepository;
import com.restaurant.menu.menu_service.repository.MenuRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
/**
 * Application service encapsulating business logic for managing menus.
 * Follows Single Responsibility Principle by handling only menu-related business logic.
 * Follows Dependency Inversion Principle by depending on abstractions (repository and mapper).
 */
public class MenuService {

    // ==================== CONSTANTS ====================
    // Error Messages
    private static final String MENU_ALREADY_EXISTS_MSG = "Menu already exists with name: %s";
    private static final String MENU_NOT_FOUND_MSG = "Menu not found with ID: %s";
    private static final String NO_ACTIVE_MENU_MSG = "No active menu found. Please activate a menu.";
    
    // Status Descriptions
    private static final String ACTIVE_STATUS_DESC = "Currently active and visible to customers";
    private static final String DRAFT_STATUS_DESC = "Draft status, not yet published";
    
    // ==================== DEPENDENCIES ====================
    private final MenuRepository menuRepository;
    private final MenuMapper menuMapper;
    private final MenuItemRepository menuItemRepository;
    private final MenuItemMapper menuItemMapper;

    // ---------------------------------------------------------------------
    // Command: Create Menu
    // ---------------------------------------------------------------------
    /**
     * Create a new menu (default status: {@code DRAFT}).
     */
    public MenuDtoResponse createMenu(String menuName) {
        if(menuRepository.existsByNameIgnoreCase(menuName)){
            throw new MenuAlreadyExistException(String.format(MENU_ALREADY_EXISTS_MSG, menuName));
        }
        Menu menu = new Menu();
        menu.setName(menuName);
        menu.setStatus(MenuStatus.DRAFT);
        menu.setCreatedAt(LocalDateTime.now());
        menu.setUpdatedAt(LocalDateTime.now());

        Menu saved = menuRepository.save(menu);
        return menuMapper.toDto(saved);
    }

    // ---------------------------------------------------------------------
    // Command: Update Menu
    // ---------------------------------------------------------------------
    /**
     * Update menu name only. Checks for name uniqueness.
     */
    public void updateMenu(Long menuId, String menuName) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_NOT_FOUND_MSG, menuId)));

        // Check if the new name already exists (excluding current menu)
        if (menuRepository.existsByNameIgnoreCaseAndIdNot(menuName, menuId)) {
            throw new MenuAlreadyExistException(String.format(MENU_ALREADY_EXISTS_MSG, menuName));
        }

        menu.setName(menuName);
        menu.setUpdatedAt(LocalDateTime.now());
        menuRepository.save(menu);
    }

    // ---------------------------------------------------------------------
    // Command: Activate Menu
    // ---------------------------------------------------------------------
    /**
     * Activate a menu by ID (sets {@code ACTIVE} and deactivates any existing active menu).
     */
    public List<MenuDtoResponse> activateMenu(Long menuId) {
        // Deactivate all currently active menus
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_NOT_FOUND_MSG, menuId)));

        Optional<Menu> activeMenu = menuRepository.findByStatus(MenuStatus.ACTIVE);
        if (activeMenu.isPresent()) {
            Menu existing = activeMenu.get();
            existing.setStatus(MenuStatus.DRAFT);
            existing.setUpdatedAt(LocalDateTime.now());
            menuRepository.save(existing);
        }

        menu.setStatus(MenuStatus.ACTIVE);
        menu.setUpdatedAt(LocalDateTime.now());
        menuRepository.save(menu);
        return getAllMenus();
    }

    // ---------------------------------------------------------------------
    // Query: Get Active Menu
    // ---------------------------------------------------------------------
    /**
     * Get the current active menu with menu items eagerly loaded.
     */
    public MenuDtoResponse getActiveMenu() {
        return menuRepository.findByStatusWithMenuItems(MenuStatus.ACTIVE)
                .map(menuMapper::toDtoWithMenuItems)
                .orElseThrow(() -> new ResourceNotFoundException(NO_ACTIVE_MENU_MSG));
    }

    // ---------------------------------------------------------------------
    // Query: Get Menu by ID
    // ---------------------------------------------------------------------
    /**
     * Get menu by ID.
     */
    public MenuDtoResponse getMenuById(Long menuId) {
        return menuRepository.findById(menuId)
                .map(menuMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_NOT_FOUND_MSG, menuId)));
    }

    // ---------------------------------------------------------------------
    // Query: List Menus (Admin)
    // ---------------------------------------------------------------------
    /**
     * List all menus (Admin only).
     */
    public List<MenuDtoResponse> getAllMenus() {
        return menuRepository.findAll()
                .stream()
                .map(menuMapper::toDto)
                .toList();
    }

    public void deleteMenu(Long menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_NOT_FOUND_MSG, menuId)));
        menuRepository.delete(menu);
    }

    public List<StatusDtoResponse> getAllStatuses() {
        return Arrays.stream(MenuStatus.values())
                .map(status -> new StatusDtoResponse(
                    status.name(),
                    getStatusDescription(status)
                ))
                .toList();
    }
    
    private String getStatusDescription(MenuStatus status) {
        return switch (status) {
            case ACTIVE -> ACTIVE_STATUS_DESC;
            case DRAFT -> DRAFT_STATUS_DESC;
        };
    }

    // ---------------------------------------------------------------------
    // Command: Update Menu Menu Items Assignments
    // ---------------------------------------------------------------------
    /**
     * Batch update menu items assigned to menus.
     * Accepts a map of menuId -> Set of menuItemIds.
     * For each menu: clears existing menu items, then assigns new ones.
     */
    public List<MenuDtoResponse> updateMenuMenuItems(UpdateMenuMenuItemsRequest request) {
        // 1. Extract all menu IDs and menu item IDs from the request
        Set<Long> menuIds = request.getAssignments().keySet();
        Set<Long> allMenuItemIds = request.getAssignments().values().stream()
                .flatMap(Set::stream)
                .collect(Collectors.toSet());
        
        // 2. Load all menus (simple - just by ID)
        List<Menu> menus = menuRepository.findAllById(menuIds);
        if (menus.size() != menuIds.size()) {
            throw new ResourceNotFoundException("One or more menus not found");
        }
        
        // 3. Load all menu items that will be assigned
        List<MenuItem> menuItems = menuItemRepository.findAllById(allMenuItemIds);
        if (menuItems.size() != allMenuItemIds.size()) {
            throw new ResourceNotFoundException("One or more menu items not found");
        }
        
        // 4. Create a map for quick lookup by ID
        Map<Long, MenuItem> menuItemMap = menuItems.stream()
                .collect(Collectors.toMap(MenuItem::getId, item -> item));
        
        // 5. For each menu: delete all existing assignments, then assign new ones
        for (Map.Entry<Long, Set<Long>> entry : request.getAssignments().entrySet()) {
            Long menuId = entry.getKey();
            Set<Long> menuItemIds = entry.getValue();
            
            // Find the menu
            Menu menu = menus.stream()
                    .filter(m -> m.getId().equals(menuId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_NOT_FOUND_MSG, menuId)));
            
            // Initialize menuItems if null
            if (menu.getMenuItems() == null) {
                menu.setMenuItems(new ArrayList<>());
            }
            
            // Clear all existing menu items (this deletes from join table)
            // Remove bidirectional relationships
            menu.getMenuItems().forEach(menuItem -> {
                if (menuItem.getMenus() != null) {
                    menuItem.getMenus().remove(menu);
                }
            });
            
            // Assign new menu items (this inserts into join table)
            List<MenuItem> newMenuItems = new ArrayList<>();
            for (Long menuItemId : menuItemIds) {
                MenuItem menuItem = menuItemMap.get(menuItemId);
                if (menuItem != null) {
                    newMenuItems.add(menuItem);
                    // Update bidirectional relationship
                    if (menuItem.getMenus() == null) {
                        menuItem.setMenus(new ArrayList<>());
                    }
                    if (!menuItem.getMenus().contains(menu)) {
                        menuItem.getMenus().add(menu);
                    }
                }
            }
            
            // Set the new menu items
            menu.setMenuItems(newMenuItems);
            
            // Save immediately to ensure changes are persisted
            menuRepository.saveAndFlush(menu);
        }
        
        // Reload all updated menus with their menu items for DTO mapping
        List<Menu> savedMenus = menuRepository.findAllWithMenuItems().stream()
                .filter(menu -> request.getAssignments().keySet().contains(menu.getId()))
                .collect(Collectors.toList());
        
        // Return updated menu DTOs with menu items
        return savedMenus.stream()
                .map(menuMapper::toDtoWithMenuItems)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // Query: Get Menu Items by Menu ID
    // ---------------------------------------------------------------------
    /**
     * Get menu items assigned to a specific menu as DTOs.
     */
    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuItemsByMenuId(Long menuId) {
        // Verify menu exists
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_NOT_FOUND_MSG, menuId)));
        if (menu.getMenuItems() == null) {
            return new ArrayList<>();
        }
        return menu.getMenuItems().stream()
                .map(menuItemMapper::toDto)
                .collect(Collectors.toList());
    }

}

