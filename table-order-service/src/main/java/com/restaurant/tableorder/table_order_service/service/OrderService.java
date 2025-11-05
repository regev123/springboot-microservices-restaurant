package com.restaurant.tableorder.table_order_service.service;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.tableorder.table_order_service.dto.Order.CreateOrderDtoRequest;
import com.restaurant.tableorder.table_order_service.dto.Order.OrderDtoResponse;
import com.restaurant.tableorder.table_order_service.entity.Order;
import com.restaurant.tableorder.table_order_service.entity.OrderItem;
import com.restaurant.tableorder.table_order_service.entity.OrderStatus;
import com.restaurant.tableorder.table_order_service.entity.Table;
import com.restaurant.tableorder.table_order_service.entity.TableStatus;
import com.restaurant.tableorder.table_order_service.exceptions.InvalidOrderStatusException;
import com.restaurant.tableorder.table_order_service.mapper.OrderMapper;
import com.restaurant.tableorder.table_order_service.repository.OrderItemRepository;
import com.restaurant.tableorder.table_order_service.repository.OrderRepository;
import com.restaurant.tableorder.table_order_service.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
/**
 * Application service encapsulating business logic for managing orders.
 * Follows Single Responsibility Principle by handling only order-related business logic.
 */
public class OrderService {

    // ==================== CONSTANTS ====================
    private static final String ORDER_NOT_FOUND_MSG = "Order not found with ID: %s";
    private static final String TABLE_NOT_FOUND_MSG = "Table not found with ID: %s";

    // ==================== DEPENDENCIES ====================
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TableRepository tableRepository;
    private final OrderMapper orderMapper;
    private final TableService tableService;

    // ---------------------------------------------------------------------
    // Command: Create Order
    // ---------------------------------------------------------------------
    /**
     * Create a new order with items and send it to kitchen immediately.
     * Orders are created with PENDING status (approved and sent to kitchen).
     */
    public OrderDtoResponse createOrder(CreateOrderDtoRequest request) {
        Table table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(TABLE_NOT_FOUND_MSG, request.getTableId())));

        // Validate order has items
        if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Create order with PENDING status (approved and sent to kitchen)
        Order order = Order.builder()
                .table(table)
                .waitressId(request.getWaitressId())
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = request.getOrderItems().stream()
                .map(itemRequest -> OrderItem.builder()
                        .order(savedOrder)
                        .menuItemId(itemRequest.getMenuItemId())
                        .menuItemName(itemRequest.getMenuItemName())
                        .quantity(itemRequest.getQuantity())
                        .price(itemRequest.getPrice())
                        .specialInstructions(itemRequest.getSpecialInstructions())
                        .build())
                .collect(Collectors.toList());

        orderItems.forEach(orderItemRepository::save);
        savedOrder.setOrderItems(orderItems);
        savedOrder.setApprovedAt(LocalDateTime.now());
        savedOrder.setSentToKitchenAt(LocalDateTime.now());

        // Recalculate total
        recalculateOrderTotal(savedOrder);
        Order saved = orderRepository.save(savedOrder);

        // Update table status to OCCUPIED if it was AVAILABLE
        if (table.getStatus() == TableStatus.AVAILABLE) {
            tableService.updateTableStatus(table.getId(), TableStatus.OCCUPIED);
        }

        // TODO: Send order to kitchen service via REST call or message queue

        return orderMapper.toDto(saved);
    }

    // ---------------------------------------------------------------------
    // Command: Cancel Order
    // ---------------------------------------------------------------------
    /**
     * Cancel an order.
     */
    public OrderDtoResponse cancelOrder(Long orderId) {
        Order order = findOrderById(orderId);

        // Only DRAFT or PENDING orders can be cancelled
        if (order.getStatus() != OrderStatus.DRAFT && order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStatusException(
                    String.format("Cannot cancel order. Current status is: %s", order.getStatus()));
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);

        return orderMapper.toDto(saved);
    }

    // ---------------------------------------------------------------------
    // Query: Get Orders by Table
    // ---------------------------------------------------------------------
    /**
     * Get all orders for a specific table.
     */
    @Transactional(readOnly = true)
    public List<OrderDtoResponse> getOrdersByTable(Long tableId) {
        List<Order> orders = orderRepository.findByTableIdWithOrderItems(tableId);
        return orders.stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // Query: Get Order by ID
    // ---------------------------------------------------------------------
    /**
     * Get an order by ID.
     */
    @Transactional(readOnly = true)
    public OrderDtoResponse getOrderById(Long orderId) {
        Order order = findOrderById(orderId);
        return orderMapper.toDto(order);
    }

    // ---------------------------------------------------------------------
    // Helper Methods
    // ---------------------------------------------------------------------
    /**
     * Find order by ID or throw exception.
     */
    private Order findOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(ORDER_NOT_FOUND_MSG, orderId)));
    }

    /**
     * Recalculate order total based on order items.
     */
    private void recalculateOrderTotal(Order order) {
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            order.setTotalAmount(BigDecimal.ZERO);
        } else {
            BigDecimal total = order.getOrderItems().stream()
                    .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            order.setTotalAmount(total);
        }
    }
}

