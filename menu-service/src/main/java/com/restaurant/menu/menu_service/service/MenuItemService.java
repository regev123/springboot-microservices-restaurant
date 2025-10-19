package com.restaurant.menu.menu_service.service;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.MenuItem.CreateMenuItemDtoRequest;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.dto.UpdateMenuItemRequest;
import com.restaurant.menu.menu_service.entity.Category;
import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuItem;
import com.restaurant.menu.menu_service.mapper.MenuItemMapper;
import com.restaurant.menu.menu_service.repository.CategoryRepository;
import com.restaurant.menu.menu_service.repository.MenuItemRepository;
import com.restaurant.menu.menu_service.repository.MenuRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
/**
 * Application service encapsulating business logic for managing menu items.
 * Follows Single Responsibility Principle by handling only menu item-related business logic.
 * Follows Dependency Inversion Principle by depending on abstractions (repositories and mapper).
 */
public class MenuItemService {

    // ==================== CONSTANTS ====================
    // Error Messages
    private static final String MENU_NOT_FOUND_MSG = "Menu not found with ID: %s";
    private static final String CATEGORY_NOT_FOUND_MSG = "Category not found with ID: %s";
    private static final String MENU_ITEM_NOT_FOUND_MSG = "Menu item not found with ID: %s";
    
    // ==================== DEPENDENCIES ====================
    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemMapper menuItemMapper;

    // ---------------------------------------------------------------------
    // Command: Create Menu Item
    // ---------------------------------------------------------------------
    /**
     * Create a new menu item.
     */
    public MenuItemDto createMenuItem(CreateMenuItemDtoRequest request) {
        Menu menu = menuRepository.findById(request.getMenuId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_NOT_FOUND_MSG, request.getMenuId())));

        Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format(CATEGORY_NOT_FOUND_MSG, request.getCategoryId())));

        MenuItem item = new MenuItem();
        item.setMenu(menu);
        item.setCategory(category);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());

        return menuItemMapper.toDto(menuItemRepository.save(item));
    }

    // ---------------------------------------------------------------------
    // Command: Update Menu Item
    // ---------------------------------------------------------------------
    /**
     * Update an existing menu item.
     */
    public MenuItemDto updateMenuItem(Long itemId, UpdateMenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_ITEM_NOT_FOUND_MSG, itemId)));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format(CATEGORY_NOT_FOUND_MSG, request.getCategoryId())));
        }

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());
        item.setCategory(category);
        item.setUpdatedAt(LocalDateTime.now());

        return menuItemMapper.toDto(menuItemRepository.save(item));
    }

    // ---------------------------------------------------------------------
    // Command: Delete Menu Item
    // ---------------------------------------------------------------------
    /**
     * Delete a menu item by ID.
     */
    public void deleteMenuItem(Long itemId) {
        if (!menuItemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException(String.format(MENU_ITEM_NOT_FOUND_MSG, itemId));
        }
        menuItemRepository.deleteById(itemId);
    }

    // ---------------------------------------------------------------------
    // Query: Get Menu Item by ID
    // ---------------------------------------------------------------------
    /**
     * Get a single menu item by ID.
     */
    public MenuItemDto getMenuItemById(Long itemId) {
        return menuItemRepository.findById(itemId)
                .map(menuItemMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_ITEM_NOT_FOUND_MSG, itemId)));
    }

    // ---------------------------------------------------------------------
    // Query: List Menu Items
    // ---------------------------------------------------------------------
    /**
     * List items with optional filters.
     */
    public List<MenuItemDto> getMenuItems(Long categoryId, Boolean available) {
        List<MenuItem> items;

        if (categoryId != null && available != null) {
            items = menuItemRepository.findByCategoryIdAndIsAvailable(categoryId, available);
        } else if (categoryId != null) {
            items = menuItemRepository.findByCategoryId(categoryId);
        } else if (available != null) {
            items = menuItemRepository.findByIsAvailable(available);
        } else {
            items = menuItemRepository.findAll();
        }

        return items.stream().map(menuItemMapper::toDto).toList();
    }

}

