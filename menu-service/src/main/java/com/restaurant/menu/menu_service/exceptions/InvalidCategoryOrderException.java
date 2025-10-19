package com.restaurant.menu.menu_service.exceptions;

public class InvalidCategoryOrderException extends RuntimeException {

    public InvalidCategoryOrderException(String message) {
        super(message);
    }
    
    public InvalidCategoryOrderException(int categoryCount) {
        super(String.format("Please ensure all categories have unique positions from 1 to %d with no gaps or duplicates.", categoryCount));
    }
}
