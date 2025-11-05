package com.restaurant.tableorder.table_order_service.repository;

import com.restaurant.tableorder.table_order_service.entity.Table;
import com.restaurant.tableorder.table_order_service.entity.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for {@link com.restaurant.tableorder.table_order_service.entity.Table} aggregates.
 */
public interface TableRepository extends JpaRepository<Table, Long> {
    
    /**
     * Find table by table number.
     */
    Optional<Table> findByTableNumber(Integer tableNumber);
    
    /**
     * Check if table number exists.
     */
    boolean existsByTableNumber(Integer tableNumber);
    
    /**
     * Check if table number exists excluding a specific table.
     */
    boolean existsByTableNumberAndIdNot(Integer tableNumber, Long id);
    
    /**
     * Find all active tables.
     */
    List<Table> findByIsActiveTrue();
    
    /**
     * Find all tables with a specific status.
     */
    List<Table> findByStatus(TableStatus status);
    
    /**
     * Get the maximum table number currently in use.
     * Returns 0 if no tables exist.
     */
    @Query("SELECT COALESCE(MAX(t.tableNumber), 0) FROM Table t")
    Integer findMaxTableNumber();
    
    /**
     * Find table by ID and eagerly fetch its orders.
     * Used when orders need to be loaded on demand.
     */
    @Query("SELECT DISTINCT t FROM Table t LEFT JOIN FETCH t.orders WHERE t.id = :id")
    Optional<Table> findByIdWithOrders(@Param("id") Long id);
}

