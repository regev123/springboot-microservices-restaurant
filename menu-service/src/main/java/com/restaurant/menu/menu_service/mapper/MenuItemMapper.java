package com.restaurant.menu.menu_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.entity.MenuItem;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between MenuItem entities and DTOs.
 * Follows Single Responsibility Principle by handling only menu item-related mappings.
 */
@Component
public class MenuItemMapper implements EntityMapper<MenuItem, MenuItemDto> {

    @Override
    public MenuItemDto toDto(MenuItem item) {
        if (item == null) {
            return null;
        }

        return new MenuItemDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.isAvailable(),
                item.getCategory() != null ? item.getCategory().getId() : null,
                item.getCategory() != null ? item.getCategory().getName() : null,
                item.getUpdatedAt()
        );
    }

    @Override
    public MenuItem toEntity(MenuItemDto dto) {
        if (dto == null) {
            return null;
        }

        MenuItem item = new MenuItem();
        item.setId(dto.getId());
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setAvailable(dto.isAvailable());
        item.setUpdatedAt(dto.getUpdatedAt());
        
        return item;
    }
}
