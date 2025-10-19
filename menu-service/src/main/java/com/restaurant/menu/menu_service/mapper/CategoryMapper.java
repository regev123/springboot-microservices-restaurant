package com.restaurant.menu.menu_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.menu.menu_service.dto.Category.CategoryDtoResponse;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapper for converting between Category entities and DTOs.
 * Follows Single Responsibility Principle by handling only category-related mappings.
 */
@Component
@RequiredArgsConstructor
public class CategoryMapper implements EntityMapper<Category, CategoryDtoResponse> {

    private final MenuItemMapper menuItemMapper;

    @Override
    public CategoryDtoResponse toDto(Category category) {
        if (category == null) {
            return null;
        }

        List<MenuItemDto> menuItemDtos = null;
        if (category.getMenuItems() != null && !category.getMenuItems().isEmpty()) {
            menuItemDtos = category.getMenuItems().stream()
                    .map(menuItemMapper::toDto)
                    .toList();
        }

        return new CategoryDtoResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getSortOrder(),
                category.getCreatedAt(),
                category.getUpdatedAt(),
                menuItemDtos
        );
    }

    @Override
    public Category toEntity(CategoryDtoResponse dto) {
        if (dto == null) {
            return null;
        }

        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setSortOrder(dto.getSortOrder());
        category.setCreatedAt(dto.getCreatedAt());
        category.setUpdatedAt(dto.getUpdatedAt());
        
        return category;
    }
}
