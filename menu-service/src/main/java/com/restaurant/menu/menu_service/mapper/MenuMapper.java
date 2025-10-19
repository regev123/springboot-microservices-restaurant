package com.restaurant.menu.menu_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.menu.menu_service.dto.Menu.MenuDtoResponse;
import com.restaurant.menu.menu_service.entity.Menu;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Menu entities and DTOs.
 * Follows Single Responsibility Principle by handling only menu-related mappings.
 */
@Component
public class MenuMapper implements EntityMapper<Menu, MenuDtoResponse> {

    @Override
    public MenuDtoResponse toDto(Menu menu) {
        if (menu == null) {
            return null;
        }

        return new MenuDtoResponse(
                menu.getId(),
                menu.getName(),
                menu.getStatus(),
                menu.getCreatedAt(),
                menu.getUpdatedAt()
        );
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
}
