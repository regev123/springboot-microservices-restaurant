package com.restaurant.tableorder.table_order_service.mapper;

import com.restaurant.common.mapper.EntityMapper;
import com.restaurant.tableorder.table_order_service.dto.Order.OrderDtoResponse;
import com.restaurant.tableorder.table_order_service.dto.Table.TableDtoResponse;
import com.restaurant.tableorder.table_order_service.entity.Table;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Table entities and DTOs.
 * Follows Single Responsibility Principle by handling only table-related mappings.
 */
@Component
@RequiredArgsConstructor
public class TableMapper implements EntityMapper<Table, TableDtoResponse> {

    private final OrderMapper orderMapper;

    @Override
    public TableDtoResponse toDto(Table table) {
        if (table == null) {
            return null;
        }

        TableDtoResponse dto = new TableDtoResponse();
        dto.setId(table.getId());
        dto.setTableNumber(table.getTableNumber());
        dto.setCapacity(table.getCapacity());
        dto.setStatus(table.getStatus());
        dto.setLocation(table.getLocation());
        dto.setIsActive(table.getIsActive());
        dto.setCreatedAt(table.getCreatedAt());
        dto.setUpdatedAt(table.getUpdatedAt());

        // Only map orders if they have been loaded (eagerly fetched)
        if (Hibernate.isInitialized(table.getOrders())) {
            List<OrderDtoResponse> orderDtos = table.getOrders() != null
                    ? table.getOrders().stream()
                            .map(orderMapper::toDto)
                            .collect(Collectors.toList())
                    : Collections.emptyList();
            dto.setOrders(orderDtos);
        } else {
            // Orders not loaded (lazy), set to null
            dto.setOrders(null);
        }

        return dto;
    }

    @Override
    public Table toEntity(TableDtoResponse dto) {
        if (dto == null) {
            return null;
        }

        Table table = new Table();
        table.setId(dto.getId());
        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());
        table.setStatus(dto.getStatus());
        table.setLocation(dto.getLocation());
        table.setIsActive(dto.getIsActive());
        table.setCreatedAt(dto.getCreatedAt());
        table.setUpdatedAt(dto.getUpdatedAt());

        return table;
    }
}

