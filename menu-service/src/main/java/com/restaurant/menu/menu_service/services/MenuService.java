package com.restaurant.menu.menu_service.services;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.MenuDto;
import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuStatus;
import com.restaurant.menu.menu_service.repository.MenuRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;

    /**
     * Create a new menu (default status: DRAFT)
     */
    public MenuDto createMenu(MenuDto request) {
        Menu menu = new Menu();
        menu.setName(request.getName());
        menu.setStatus(MenuStatus.DRAFT);
        menu.setCreatedAt(LocalDateTime.now());
        menu.setUpdatedAt(LocalDateTime.now());

        Menu saved = menuRepository.save(menu);
        return toDto(saved);
    }

    /**
     * Update menu metadata (name, etc.)
     */
    public MenuDto updateMenu(Long menuId, MenuDto request) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with ID: " + menuId));

        menu.setName(request.getName());
        menu.setUpdatedAt(LocalDateTime.now());

        return toDto(menuRepository.save(menu));
    }

    /**
     * Activate a menu (sets ACTIVE and deactivates others)
     */
    public MenuDto activateMenu(Long menuId) {
        // Deactivate all currently active menus
        menuRepository.updateStatusForAll(MenuStatus.DRAFT);

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with ID: " + menuId));

        menu.setStatus(MenuStatus.ACTIVE);
        menu.setUpdatedAt(LocalDateTime.now());

        return toDto(menuRepository.save(menu));
    }

    /**
     * Get the current active menu
     */
    public MenuDto getActiveMenu() {
        Menu menu = menuRepository.findByStatus(MenuStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active menu found"));
        return toDto(menu);
    }

    /**
     * Get menu by ID
     */
    public MenuDto getMenuById(Long menuId) {
        return menuRepository.findById(menuId)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with ID: " + menuId));
    }

    /**
     * List all menus (Admin only)
     */
    public List<MenuDto> getAllMenus() {
        return menuRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    private MenuDto toDto(Menu menu) {
        return new MenuDto(menu.getId(), menu.getName(), menu.getStatus(), menu.getCreatedAt(), menu.getUpdatedAt());
    }
}

