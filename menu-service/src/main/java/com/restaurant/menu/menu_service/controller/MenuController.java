package com.restaurant.menu.menu_service.controller;

import com.restaurant.menu.menu_service.dto.MenuDto;
import com.restaurant.menu.menu_service.services.MenuService;
import com.restaurant.menu.menu_service.util.AuthorizationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;
    private final AuthorizationUtil authorizationUtil;

    @PostMapping
    public ResponseEntity<MenuDto> createMenu(@RequestHeader("X-User-Role") String userRole,
                                              @Valid @RequestBody MenuDto request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createMenu(request));
    }

    @PutMapping("/{menuId}")
    public ResponseEntity<MenuDto> updateMenu(
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable Long menuId,
            @Valid @RequestBody MenuDto request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.ok(menuService.updateMenu(menuId, request));
    }

    @PutMapping("/{menuId}/activate")
    public ResponseEntity<MenuDto> activateMenu(@RequestHeader("X-User-Role") String userRole,
                                                @PathVariable Long menuId
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.ok(menuService.activateMenu(menuId));
    }

    @GetMapping
    public ResponseEntity<MenuDto> getActiveMenu() {
        return ResponseEntity.ok(menuService.getActiveMenu());
    }

    @GetMapping("/{menuId}")
    public ResponseEntity<MenuDto> getMenuById(@PathVariable Long menuId) {
        return ResponseEntity.ok(menuService.getMenuById(menuId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<MenuDto>> getAllMenus(@RequestHeader("X-User-Role") String userRole
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.ok(menuService.getAllMenus());
    }
}

