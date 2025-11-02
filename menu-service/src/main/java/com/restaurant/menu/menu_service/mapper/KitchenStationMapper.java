package com.restaurant.menu.menu_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.menu.menu_service.dto.KitchenStation.KitchenStationDto;
import com.restaurant.menu.menu_service.dto.MenuItem.MenuItemDto;
import com.restaurant.menu.menu_service.entity.KitchenStation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapper for converting between KitchenStation entities and DTOs.
 * Follows Single Responsibility Principle by handling only kitchen station-related mappings.
 */
@Component
@RequiredArgsConstructor
public class KitchenStationMapper implements EntityMapper<KitchenStation, KitchenStationDto> {
    
    private final MenuItemMapper menuItemMapper;
    
    @Override
    public KitchenStationDto toDto(KitchenStation kitchenStation) {
        if (kitchenStation == null) {
            return null;
        }
        
        KitchenStationDto dto = new KitchenStationDto();
        dto.setId(kitchenStation.getId());
        dto.setName(kitchenStation.getName());
        dto.setIsActive(kitchenStation.getIsActive());
        dto.setCreatedAt(kitchenStation.getCreatedAt());
        dto.setUpdatedAt(kitchenStation.getUpdatedAt());
        dto.setMenuItemsCount(kitchenStation.getMenuItemsCount());
        return dto;
    }
    
    @Override
    public KitchenStation toEntity(KitchenStationDto dto) {
        if (dto == null) {
            return null;
        }
        
        KitchenStation kitchenStation = new KitchenStation();
        kitchenStation.setId(dto.getId());
        kitchenStation.setName(dto.getName());
        kitchenStation.setIsActive(dto.getIsActive());
        kitchenStation.setCreatedAt(dto.getCreatedAt());
        kitchenStation.setUpdatedAt(dto.getUpdatedAt());
        kitchenStation.setMenuItemsCount(dto.getMenuItemsCount());

        
        return kitchenStation;
    }
    
    /**
     * Convert KitchenStation entity to DTO with menu items (for admin panel).
     * This method explicitly ensures menu items are included.
     */
    public KitchenStationDto toDtoWithMenuItems(KitchenStation kitchenStation) {
        if (kitchenStation == null) {
            return null;
        }
        
        KitchenStationDto dto = toDto(kitchenStation); // Get basic info and any loaded menu items
        
        // Ensure menu items are converted to DTOs
        if (kitchenStation.getMenuItems() != null) {
            List<MenuItemDto> menuItemDtos = kitchenStation.getMenuItems().stream()
                    .map(menuItemMapper::toDto)
                    .toList();
            dto.setMenuItems(menuItemDtos);
        } else {
            dto.setMenuItems(null);
        }
        
        return dto;
    }
}
