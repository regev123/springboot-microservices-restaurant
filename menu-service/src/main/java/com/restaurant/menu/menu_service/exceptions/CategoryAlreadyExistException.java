package com.restaurant.menu.menu_service.exceptions;

public class CategoryAlreadyExistException extends RuntimeException{

    public CategoryAlreadyExistException (String message){
        super(message);
    }
}
