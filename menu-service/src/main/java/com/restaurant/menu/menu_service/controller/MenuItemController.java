package com.restaurant.menu.menu_service.controller;

import com.restaurant.menu.menu_service.dto.CreateMenuItemRequest;
import com.restaurant.menu.menu_service.dto.MenuItemDto;
import com.restaurant.menu.menu_service.dto.UpdateMenuItemRequest;
import com.restaurant.menu.menu_service.services.MenuItemService;
import com.restaurant.menu.menu_service.util.AuthorizationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu/items")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;
    private final AuthorizationUtil authorizationUtil;


    @PostMapping
    public ResponseEntity<MenuItemDto> createMenuItem(@RequestHeader("X-User-Role") String userRole,
                                                      @Valid @RequestBody CreateMenuItemRequest request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.status(HttpStatus.CREATED).body(menuItemService.createMenuItem(request));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateMenuItemRequest request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.ok(menuItemService.updateMenuItem(itemId, request));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteMenuItem(@RequestHeader("X-User-Role") String userRole,
                                               @PathVariable Long itemId
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        menuItemService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean available
    ) {
        return ResponseEntity.ok(menuItemService.getMenuItems(categoryId, available));
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long itemId) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(itemId));
    }
}

