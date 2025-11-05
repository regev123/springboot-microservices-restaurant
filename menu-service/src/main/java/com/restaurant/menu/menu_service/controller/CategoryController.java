package com.restaurant.menu.menu_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.menu.menu_service.dto.Category.CategoryDtoResponse;
import com.restaurant.menu.menu_service.dto.Category.CreateCategoryDtoRequest;
import com.restaurant.menu.menu_service.dto.Category.UpdateCategoryDtoRequest;
import com.restaurant.menu.menu_service.dto.Category.UpdateOrderDtoRequest;
import com.restaurant.menu.menu_service.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Category Management", description = "Endpoints for managing menu categories. Admin operations require ADMIN role.")
@SecurityRequirement(name = "Bearer Authentication")
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
    @Operation(summary = "Create category", description = "Creates a new category. Requires ADMIN role.")
    public ResponseEntity<CategoryDtoResponse> createCategory(@Valid @RequestBody CreateCategoryDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request.getName(), request.getDescription()));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Category (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Update an existing category. Admin only.
     *
     * @param request category update payload containing ID, name, and description
     * @return the updated category
     */
    @PutMapping("/admin/update")
    @RequiresRole("ADMIN")
    @Operation(summary = "Update category", description = "Updates an existing category. Requires ADMIN role.")
    public ResponseEntity<CategoryDtoResponse> updateCategory(@Valid @RequestBody UpdateCategoryDtoRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(request.getId(), request.getName(), request.getDescription()));
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
    @Operation(summary = "Delete category", description = "Deletes a category by ID. Requires ADMIN role.")
    public ResponseEntity<List<CategoryDtoResponse>> deleteCategory(@PathVariable("categoryId") Long categoryId) {
        List<CategoryDtoResponse> updatedCategories = categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(updatedCategories);
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
    @Operation(summary = "Update category order", description = "Updates the order of multiple categories in batch. Accepts a list of category order updates. Requires ADMIN role.")
    public ResponseEntity<List<CategoryDtoResponse>> updateCategoryOrder(
            @Valid @RequestBody List<UpdateOrderDtoRequest> orderChanges) {
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
    @Operation(summary = "List all categories", description = "Lists all categories. Public endpoint.")
    public ResponseEntity<List<CategoryDtoResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}

