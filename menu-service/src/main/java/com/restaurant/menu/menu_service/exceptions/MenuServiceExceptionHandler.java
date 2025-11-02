package com.restaurant.menu.menu_service.exceptions;

import com.restaurant.common.exception.GlobalExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
/**
 * Service-specific exception translations for the Menu Service.
 * <p>
 * Extends the common {@link com.restaurant.common.exception.GlobalExceptionHandler}
 * to provide additional mappings for domain-specific exceptions.
 * </p>
 */
public class MenuServiceExceptionHandler extends GlobalExceptionHandler {

    @ExceptionHandler(CategoryAlreadyExistException.class)
    public ResponseEntity<Map<String, Object>> handleCategoryAlreadyExist(CategoryAlreadyExistException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Duplicate Categories", ex.getMessage());
    }

    @ExceptionHandler(MenuAlreadyExistException.class)
    public ResponseEntity<Map<String, Object>> handleMenuAlreadyExist(MenuAlreadyExistException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Duplicate Menus", ex.getMessage());
    }

    @ExceptionHandler(InvalidCategoryOrderException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCategoryOrder(InvalidCategoryOrderException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Invalid Category Order", ex.getMessage());
    }

    @ExceptionHandler(MenuItemAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleMenuItemAlreadyExists(MenuItemAlreadyExistsException ex) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Duplicate Menu Items", ex.getMessage());
    }
}
