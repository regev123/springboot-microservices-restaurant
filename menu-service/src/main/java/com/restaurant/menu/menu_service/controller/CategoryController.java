package com.restaurant.menu.menu_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.menu.menu_service.dto.Category.CategoryDtoResponse;
import com.restaurant.menu.menu_service.dto.Category.CreateCategoryDtoRequest;
import com.restaurant.menu.menu_service.dto.Category.UpdateOrderDtoRequest;
import com.restaurant.menu.menu_service.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing endpoints for managing menu categories.
 * Follows Single Responsibility Principle by handling only category-related HTTP operations.
 * Uses aspect-oriented authorization to eliminate code duplication.
 */
@RestController
@RequestMapping("/menu/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;

    // ---------------------------------------------------------------------
    // Endpoint: Create Category (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Create a new category. Admin only.
     *
     * @param request category creation payload
     * @return the created category
     */
    @PostMapping("/admin/create")
    @RequiresRole("ADMIN")
    public ResponseEntity<CategoryDtoResponse> createCategory(@Valid @RequestBody CreateCategoryDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request.getName(), request.getDescription()));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Delete Category (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Delete a category by ID. Admin only.
     *
     * @param categoryId identifier of the category to delete
     */
    @DeleteMapping("/admin/{categoryId}")
    @RequiresRole("ADMIN")
    public ResponseEntity<Void> deleteCategory(@PathVariable("categoryId") Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Category Order (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Update the order of multiple categories. Admin only.
     * Accepts a list of category order updates and applies them in batch.
     *
     * @param orderChanges list of category order updates containing id and newOrder
     * @return list of updated categories with their new order
     */
    @PutMapping("/admin/update-order")
    @RequiresRole("ADMIN")
    public ResponseEntity<List<CategoryDtoResponse>> updateCategoryOrder(
            @Valid @RequestBody List<UpdateOrderDtoRequest> orderChanges) {
        log.info("Updating category order: {}", orderChanges);
        List<CategoryDtoResponse> updatedCategories = categoryService.updateCategoryOrder(orderChanges);
        return ResponseEntity.ok(updatedCategories);
    }

    // ---------------------------------------------------------------------
    // Endpoint: List Categories (PUBLIC)
    // ---------------------------------------------------------------------
    /**
     * List all categories.
     *
     * @return list of categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDtoResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}

