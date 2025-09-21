package com.restaurant.menu.menu_service.services;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.CreateMenuItemRequest;
import com.restaurant.menu.menu_service.dto.MenuItemDto;
import com.restaurant.menu.menu_service.dto.UpdateMenuItemRequest;
import com.restaurant.menu.menu_service.entity.Category;
import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuItem;
import com.restaurant.menu.menu_service.repository.CategoryRepository;
import com.restaurant.menu.menu_service.repository.MenuItemRepository;
import com.restaurant.menu.menu_service.repository.MenuRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemService {

    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Create a new menu item
     */
    public MenuItemDto createMenuItem(CreateMenuItemRequest request) {
        Menu menu = menuRepository.findById(request.getMenuId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with ID: " + request.getMenuId()));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        }

        MenuItem item = new MenuItem();
        item.setMenu(menu);
        item.setCategory(category);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());
        item.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());
        item.setUpdatedAt(LocalDateTime.now());

        return toDto(menuItemRepository.save(item));
    }

    /**
     * Update an existing menu item
     */
    public MenuItemDto updateMenuItem(Long itemId, UpdateMenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID: " + itemId));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        }

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());
        item.setCategory(category);
        item.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());
        item.setUpdatedAt(LocalDateTime.now());

        return toDto(menuItemRepository.save(item));
    }

    /**
     * Delete a menu item
     */
    public void deleteMenuItem(Long itemId) {
        if (!menuItemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException("Menu item not found with ID: " + itemId);
        }
        menuItemRepository.deleteById(itemId);
    }

    /**
     * Get a single menu item
     */
    public MenuItemDto getMenuItemById(Long itemId) {
        return menuItemRepository.findById(itemId)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID: " + itemId));
    }

    /**
     * List items with optional filters
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

        return items.stream().map(this::toDto).toList();
    }

    private MenuItemDto toDto(MenuItem item) {
        return new MenuItemDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.isAvailable(),
                item.getCategory() != null ? item.getCategory().getId() : null,
                item.getCategory() != null ? item.getCategory().getName() : null,
                item.getTags(),
                item.getUpdatedAt()
        );
    }
}

