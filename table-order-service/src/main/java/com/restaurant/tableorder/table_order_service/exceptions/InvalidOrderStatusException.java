package com.restaurant.tableorder.table_order_service.exceptions;

/**
 * Exception thrown when attempting to perform an operation on an order with an invalid status.
 */
public class InvalidOrderStatusException extends RuntimeException {
    public InvalidOrderStatusException(String message) {
        super(message);
    }
}

