package com.restaurant.menu.menu_service.exceptions;

public class MenuItemAlreadyExistsException extends RuntimeException{
    public MenuItemAlreadyExistsException(String message){
        super(message);
    }
}