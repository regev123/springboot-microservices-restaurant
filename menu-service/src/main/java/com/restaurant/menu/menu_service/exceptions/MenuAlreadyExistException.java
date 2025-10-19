package com.restaurant.menu.menu_service.exceptions;

public class MenuAlreadyExistException extends RuntimeException{

    public MenuAlreadyExistException(String message){
        super(message);
    }
}
