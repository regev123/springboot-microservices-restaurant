package com.restaurant.tableorder.table_order_service.entity;

/**
 * Represents the different statuses an order can have.
 */
public enum OrderStatus {
    /** Order is being created, not yet finalized */
    DRAFT,
    
    /** Order has been approved and sent to kitchen */
    PENDING,
    
    /** Order is being prepared in kitchen */
    PREPARING,
    
    /** Order is ready for serving */
    READY,
    
    /** Order has been completed */
    COMPLETED,
    
    /** Order has been cancelled */
    CANCELLED
}

