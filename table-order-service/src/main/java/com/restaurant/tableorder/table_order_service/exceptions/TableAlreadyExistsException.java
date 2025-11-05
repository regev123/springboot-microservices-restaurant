package com.restaurant.tableorder.table_order_service.exceptions;

/**
 * Exception thrown when attempting to create a table with a number that already exists.
 */
public class TableAlreadyExistsException extends RuntimeException {
    public TableAlreadyExistsException(String message) {
        super(message);
    }
}

