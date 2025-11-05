package com.restaurant.tableorder.table_order_service.exceptions;

import com.restaurant.common.exception.GlobalExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
/**
 * Service-specific exception translations for the Table Order Service.
 * <p>
 * Extends the common {@link com.restaurant.common.exception.GlobalExceptionHandler}
 * to provide additional mappings for domain-specific exceptions.
 * </p>
 */
public class TableOrderServiceExceptionHandler extends GlobalExceptionHandler {

    @ExceptionHandler(TableAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleTableAlreadyExists(TableAlreadyExistsException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Duplicate Table", ex.getMessage());
    }

    @ExceptionHandler(InvalidOrderStatusException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidOrderStatus(InvalidOrderStatusException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Invalid Order Status", ex.getMessage());
    }
}

