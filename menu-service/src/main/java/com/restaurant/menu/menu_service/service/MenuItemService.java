package com.restaurant.menu.menu_service.service;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.exceptions.MenuItemAlreadyExistsException;
import com.restaurant.menu.menu_service.dto.MenuItem.CreateMenuItemDtoRequest;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.dto.UpdateMenuItemRequest;
import com.restaurant.menu.menu_service.entity.Category;
import com.restaurant.menu.menu_service.entity.MenuItem;
import com.restaurant.menu.menu_service.mapper.MenuItemMapper;
import com.restaurant.menu.menu_service.repository.CategoryRepository;
import com.restaurant.menu.menu_service.repository.MenuItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    private static final String CATEGORY_NOT_FOUND_MSG = "Category not found with ID: %s";
    private static final String MENU_ITEM_NOT_FOUND_MSG = "Menu item not found with ID: %s";
    private static final String MENU_ITEM_NAME_EXISTS_MSG = "Menu item with name '%s' already exists";
    
    // ==================== DEPENDENCIES ====================
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
        
        // 1. Check if menu item with the same name already exists
        if (menuItemRepository.existsByNameIgnoreCase(request.getName())) {
            throw new MenuItemAlreadyExistsException(String.format(MENU_ITEM_NAME_EXISTS_MSG, request.getName()));
        }
        
        // 2. Find the category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format(CATEGORY_NOT_FOUND_MSG, request.getCategoryId())));

        // 3. Create the menu item entity using Builder pattern
        MenuItem menuItem = MenuItem.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .isAvailable(request.getIsAvailable())
                .ingredients(request.getIngredients())
                .build();

        // 5. Save and return
        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return menuItemMapper.toDto(savedMenuItem);
    }

    // ---------------------------------------------------------------------
    // Command: Update Menu Item
    // ---------------------------------------------------------------------
    /**
     * Update an existing menu item.
     */
    public MenuItemDto updateMenuItem(UpdateMenuItemRequest request) {
        Long itemId = request.getId();
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(MENU_ITEM_NOT_FOUND_MSG, itemId)));

        // Check if another menu item with the same name already exists (excluding current item)
        if (menuItemRepository.existsByNameIgnoreCaseAndIdNot(request.getName(), itemId)) {
            throw new MenuItemAlreadyExistsException(String.format(MENU_ITEM_NAME_EXISTS_MSG, request.getName()));
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format(CATEGORY_NOT_FOUND_MSG, request.getCategoryId())));
        }

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setIsAvailable(request.getIsAvailable());
        item.setCategory(category);
        item.setIngredients(request.getIngredients());
        item.setUpdatedAt(LocalDateTime.now());

        MenuItem savedMenuItem = menuItemRepository.save(item);
        return menuItemMapper.toDto(savedMenuItem);
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
    public List<MenuItemDto> getMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(menuItemMapper::toDto)
                .collect(Collectors.toList());
    }

}

