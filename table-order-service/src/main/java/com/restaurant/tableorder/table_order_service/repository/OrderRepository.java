package com.restaurant.tableorder.table_order_service.repository;

import com.restaurant.tableorder.table_order_service.entity.Order;
import com.restaurant.tableorder.table_order_service.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data repository for {@link com.restaurant.tableorder.table_order_service.entity.Order} aggregates.
 */
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Find all orders for a specific table.
     */
    List<Order> findByTableId(Long tableId);
    
    /**
     * Find all orders with a specific status.
     */
    List<Order> findByStatus(OrderStatus status);
    
    /**
     * Find all orders for a table with a specific status.
     */
    List<Order> findByTableIdAndStatus(Long tableId, OrderStatus status);
    
    /**
     * Find all orders with their items eagerly loaded.
     */
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems")
    List<Order> findAllWithOrderItems();
    
    /**
     * Find orders for a table with items eagerly loaded.
     */
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.table.id = :tableId")
    List<Order> findByTableIdWithOrderItems(@Param("tableId") Long tableId);
}

