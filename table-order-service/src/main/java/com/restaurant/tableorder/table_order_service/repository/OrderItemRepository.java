package com.restaurant.tableorder.table_order_service.repository;

import com.restaurant.tableorder.table_order_service.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data repository for {@link com.restaurant.tableorder.table_order_service.entity.OrderItem} aggregates.
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    /**
     * Find all order items for a specific order.
     */
    List<OrderItem> findByOrderId(Long orderId);
    
    /**
     * Delete all order items for a specific order.
     */
    void deleteByOrderId(Long orderId);
}

