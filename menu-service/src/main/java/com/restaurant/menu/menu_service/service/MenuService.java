package com.restaurant.menu.menu_service.service;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.Menu.MenuDtoResponse;
import com.restaurant.menu.menu_service.dto.Menu.StatusDtoResponse;
import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuStatus;
import com.restaurant.menu.menu_service.exceptions.MenuAlreadyExistException;
import com.restaurant.menu.menu_service.mapper.MenuMapper;
import com.restaurant.menu.menu_service.repository.MenuRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
     * Get the current active menu.
     */
    public MenuDtoResponse getActiveMenu() {
        return menuRepository.findByStatus(MenuStatus.ACTIVE)
                .map(menuMapper::toDto)
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

}

