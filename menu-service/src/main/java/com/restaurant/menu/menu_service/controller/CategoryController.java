package com.restaurant.menu.menu_service.controller;

import com.restaurant.menu.menu_service.dto.CategoryDto;
import com.restaurant.menu.menu_service.services.CategoryService;
import com.restaurant.menu.menu_service.util.AuthorizationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final AuthorizationUtil authorizationUtil;

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestHeader("X-User-Role") String userRole,
                                                      @Valid @RequestBody CategoryDto request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(request));
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> updateCategory(
            @RequestHeader("X-User-Role") String userRole,
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDto request
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, request));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@RequestHeader("X-User-Role") String userRole,
                                               @PathVariable Long categoryId
    ) {
        authorizationUtil.checkRole(userRole,"ADMIN");
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }
}

