package com.restaurant.tableorder.table_order_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.tableorder.table_order_service.dto.Order.OrderItemDto;
import com.restaurant.tableorder.table_order_service.entity.OrderItem;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between OrderItem entities and DTOs.
 */
@Component
public class OrderItemMapper implements EntityMapper<OrderItem, OrderItemDto> {

    @Override
    public OrderItemDto toDto(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setMenuItemId(orderItem.getMenuItemId());
        dto.setMenuItemName(orderItem.getMenuItemName());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setSpecialInstructions(orderItem.getSpecialInstructions());
        dto.setCreatedAt(orderItem.getCreatedAt());
        dto.setUpdatedAt(orderItem.getUpdatedAt());

        return dto;
    }

    @Override
    public OrderItem toEntity(OrderItemDto dto) {
        if (dto == null) {
            return null;
        }

        OrderItem orderItem = new OrderItem();
        orderItem.setId(dto.getId());
        orderItem.setMenuItemId(dto.getMenuItemId());
        orderItem.setMenuItemName(dto.getMenuItemName());
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setPrice(dto.getPrice());
        orderItem.setSpecialInstructions(dto.getSpecialInstructions());
        orderItem.setCreatedAt(dto.getCreatedAt());
        orderItem.setUpdatedAt(dto.getUpdatedAt());

        return orderItem;
    }
}

