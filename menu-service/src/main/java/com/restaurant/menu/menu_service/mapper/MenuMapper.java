package com.restaurant.menu.menu_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.menu.menu_service.dto.Menu.MenuDtoResponse;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.entity.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapper for converting between Menu entities and DTOs.
 * Follows Single Responsibility Principle by handling only menu-related mappings.
 */
@Component
@RequiredArgsConstructor
public class MenuMapper implements EntityMapper<Menu, MenuDtoResponse> {

    private final MenuItemMapper menuItemMapper;

    @Override
    public MenuDtoResponse toDto(Menu menu) {
        if (menu == null) {
            return null;
        }

        MenuDtoResponse dto = new MenuDtoResponse();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setStatus(menu.getStatus());
        dto.setCreatedAt(menu.getCreatedAt());
        dto.setUpdatedAt(menu.getUpdatedAt());
        
        return dto;
    }

    @Override
    public Menu toEntity(MenuDtoResponse dto) {
        if (dto == null) {
            return null;
        }

        Menu menu = new Menu();
        menu.setId(dto.getId());
        menu.setName(dto.getName());
        menu.setStatus(dto.getStatus());
        menu.setCreatedAt(dto.getCreatedAt());
        menu.setUpdatedAt(dto.getUpdatedAt());
        
        return menu;
    }

    /**
     * Maps Menu entity to DTO with menu items explicitly included.
     */
    public MenuDtoResponse toDtoWithMenuItems(Menu menu) {
        if (menu == null) {
            return null;
        }
        MenuDtoResponse dto = toDto(menu);
        if (menu.getMenuItems() != null) {
            List<MenuItemDto> menuItemDtos = menu.getMenuItems().stream()
                    .map(menuItemMapper::toDto)
                    .toList();
            dto.setMenuItems(menuItemDtos);
        } else {
            dto.setMenuItems(null);
        }
        return dto;
    }
}
