package com.restaurant.tableorder.table_order_service.entity;

/**
 * Represents the different statuses a table can have.
 */
public enum TableStatus {
    /** Table is available for seating */
    AVAILABLE,
    
    /** Table is currently occupied */
    OCCUPIED,
    
    /** Table is reserved */
    RESERVED,
    
    /** Table is being cleaned */
    CLEANING
}

