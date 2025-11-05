package com.restaurant.tableorder.table_order_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.tableorder.table_order_service.dto.Order.OrderDtoResponse;
import com.restaurant.tableorder.table_order_service.dto.Order.OrderItemDto;
import com.restaurant.tableorder.table_order_service.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Order entities and DTOs.
 * Follows Single Responsibility Principle by handling only order-related mappings.
 */
@Component
@RequiredArgsConstructor
public class OrderMapper implements EntityMapper<Order, OrderDtoResponse> {

    private final OrderItemMapper orderItemMapper;

    @Override
    public OrderDtoResponse toDto(Order order) {
        if (order == null) {
            return null;
        }

        OrderDtoResponse dto = new OrderDtoResponse();
        dto.setId(order.getId());
        dto.setTableId(order.getTable().getId());
        dto.setTableNumber(order.getTable().getTableNumber());
        dto.setWaitressId(order.getWaitressId());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setApprovedAt(order.getApprovedAt());
        dto.setSentToKitchenAt(order.getSentToKitchenAt());

        if (order.getOrderItems() != null) {
            List<OrderItemDto> orderItemDtos = order.getOrderItems().stream()
                    .map(orderItemMapper::toDto)
                    .collect(Collectors.toList());
            dto.setOrderItems(orderItemDtos);
        }

        return dto;
    }

    @Override
    public Order toEntity(OrderDtoResponse dto) {
        if (dto == null) {
            return null;
        }

        Order order = new Order();
        order.setId(dto.getId());
        order.setWaitressId(dto.getWaitressId());
        order.setStatus(dto.getStatus());
        order.setTotalAmount(dto.getTotalAmount());
        order.setCreatedAt(dto.getCreatedAt());
        order.setApprovedAt(dto.getApprovedAt());
        order.setSentToKitchenAt(dto.getSentToKitchenAt());

        return order;
    }
}

