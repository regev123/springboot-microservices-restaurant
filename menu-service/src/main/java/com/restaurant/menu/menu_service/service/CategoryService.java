package com.restaurant.menu.menu_service.service;


import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.Category.CategoryDtoResponse;
import com.restaurant.menu.menu_service.dto.Category.UpdateOrderDtoRequest;
import com.restaurant.menu.menu_service.entity.Category;
import com.restaurant.menu.menu_service.exceptions.CategoryAlreadyExistException;
import com.restaurant.menu.menu_service.exceptions.InvalidCategoryOrderException;
import com.restaurant.menu.menu_service.mapper.CategoryMapper;
import com.restaurant.menu.menu_service.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
/**
 * Application service encapsulating business logic for managing categories.
 * Follows Single Responsibility Principle by handling only category-related business logic.
 * Follows Dependency Inversion Principle by depending on abstractions (repository and mapper).
 */
public class CategoryService {

    // ==================== CONSTANTS ====================
    private static final int DEFAULT_SORT_ORDER = 1;
    private static final int ORDER_INCREMENT = 1;
    
    // Error Messages
    private static final String CATEGORY_ALREADY_EXISTS_MSG = "Cannot create category: '%s' already exists. Category names must be unique.";
    private static final String CATEGORY_NOT_FOUND_DELETE_MSG = "Cannot delete category: category with ID %d not found.";
    private static final String CATEGORIES_NOT_FOUND_MSG = "Cannot update category order: %d categories not found with IDs: %s";
    
    // ==================== DEPENDENCIES ====================
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    // ---------------------------------------------------------------------
    // Command: Create Category
    // ---------------------------------------------------------------------
    /**
     * Create a new category with automatic ordering.
     */
    public CategoryDtoResponse createCategory(String categoryName) {
        return createCategory(categoryName, null);
    }

    /**
     * Create a new category with name and description and automatic ordering.
     * Validates uniqueness and assigns the next available sort order.
     * 
     * @param categoryName the name of the category (must be unique)
     * @param description optional description of the category
     * @return the created category as DTO
     * @throws CategoryAlreadyExistException if category name already exists
     */
    public CategoryDtoResponse createCategory(String categoryName, String description) {
        validateCategoryNameUniqueness(categoryName);
        
        Category category = buildNewCategory(categoryName, description);
        Category savedCategory = categoryRepository.save(category);
        
        return categoryMapper.toDto(savedCategory);
    }
    
    /**
     * Validate that the category name is unique (case-insensitive).
     * 
     * @param categoryName the name to validate
     * @throws CategoryAlreadyExistException if name already exists
     */
    private void validateCategoryNameUniqueness(String categoryName) {
        if (categoryRepository.existsByNameIgnoreCase(categoryName)) {
            throw new CategoryAlreadyExistException(
                String.format(CATEGORY_ALREADY_EXISTS_MSG, categoryName)
            );
        }
    }
    
    /**
     * Build a new category entity with the provided data and automatic ordering.
     * 
     * @param categoryName the name of the category
     * @param description optional description
     * @return new category entity ready for persistence
     */
    private Category buildNewCategory(String categoryName, String description) {
        Category category = new Category();
        category.setName(categoryName);
        category.setDescription(description);
        category.setSortOrder(getNextSortOrder());
        return category;
    }

    // ---------------------------------------------------------------------
    // Command: Delete Category
    // ---------------------------------------------------------------------
    /**
     * Delete a category by ID and automatically reorder remaining categories.
     * Maintains sequential ordering after deletion.
     * 
     * @param categoryId the ID of the category to delete
     * @throws ResourceNotFoundException if category doesn't exist
     */
    public void deleteCategory(Long categoryId) {
        Category categoryToDelete = findCategoryById(categoryId);
        Integer deletedOrder = categoryToDelete.getSortOrder();
        
        categoryRepository.deleteById(categoryId);
        reorderCategoriesAfterDeletion(deletedOrder);
    }
    
    /**
     * Find a category by ID with proper error handling.
     * 
     * @param categoryId the ID of the category to find
     * @return the found category
     * @throws ResourceNotFoundException if category doesn't exist
     */
    private Category findCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    String.format(CATEGORY_NOT_FOUND_DELETE_MSG, categoryId)
                ));
    }

    // ---------------------------------------------------------------------
    // Query: List Categories
    // ---------------------------------------------------------------------
    /**
     * List all categories ordered by sortOrder.
     */
    public List<CategoryDtoResponse> getAllCategories() {
        return categoryRepository.findAllByOrderBySortOrderAsc().stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    // ---------------------------------------------------------------------
    // Command: Update Category Order
    // ---------------------------------------------------------------------
    /**
     * Update the order of multiple categories in batch.
     * Validates all category IDs exist and newOrder values are unique and sequential.
     * Updates sortOrder for each category and saves all changes in a transaction.
     *
     * @param orderChanges list of category order updates containing id and newOrder
     * @return list of updated categories with their new order
     * @throws ResourceNotFoundException if any category ID doesn't exist
     * @throws IllegalArgumentException if newOrder values are invalid
     */
    public List<CategoryDtoResponse> updateCategoryOrder(List<UpdateOrderDtoRequest> orderChanges) {
        // Extract category IDs once for better performance
        List<Long> categoryIds = extractCategoryIds(orderChanges);
        
        validateCategoryIdsExist(orderChanges, categoryIds);
        
        validateOrderValues(orderChanges);
        
        List<Category> updatedCategories = updateCategorySortOrders(orderChanges, categoryIds);
        
        categoryRepository.saveAll(updatedCategories);
        
        return getAllCategories();
    }

    // ---------------------------------------------------------------------
    // Private Helper Methods
    // ---------------------------------------------------------------------
    
    /**
     * Extract category IDs from order changes list.
     * 
     * @param orderChanges list of order changes
     * @return list of category IDs
     */
    private List<Long> extractCategoryIds(List<UpdateOrderDtoRequest> orderChanges) {
        return orderChanges.stream()
                .map(UpdateOrderDtoRequest::getId)
                .toList();
    }
        
    /**
     * Create a lookup map for new order values by category ID.
     * 
     * @param orderChanges list of order changes
     * @return map of category ID to new order value
     */
    private Map<Long, Integer> createOrderLookupMap(List<UpdateOrderDtoRequest> orderChanges) {
        return orderChanges.stream()
                .collect(Collectors.toMap(
                    UpdateOrderDtoRequest::getId,
                    UpdateOrderDtoRequest::getNewOrder
                ));
    }

    /**
     * Get the next available sort order (highest order + 1).
     * 
     * @return the next available sort order value
     */
    private Integer getNextSortOrder() {
        Category highestOrderCategory = categoryRepository.findTopByOrderBySortOrderDesc();
        return highestOrderCategory != null ? 
            highestOrderCategory.getSortOrder() + ORDER_INCREMENT : 
            DEFAULT_SORT_ORDER;
    }

    /**
     * Reorder categories after deletion: decrease order by 1 for categories with order > deletedOrder.
     * Uses batch operation for optimal performance.
     * 
     * @param deletedOrder the sort order of the deleted category
     */
    private void reorderCategoriesAfterDeletion(Integer deletedOrder) {
        List<Category> categoriesToReorder = categoryRepository.findBySortOrderGreaterThan(deletedOrder);
        
        if (!categoriesToReorder.isEmpty()) {
            categoriesToReorder.forEach(category -> 
                category.setSortOrder(category.getSortOrder() - ORDER_INCREMENT)
            );
            categoryRepository.saveAll(categoriesToReorder); // Batch save for performance
        }
    }

    /**
     * Validate that all category IDs in the order changes exist in the database.
     * Uses efficient batch lookup to minimize database calls.
     *
     * @param orderChanges list of order changes to validate
     * @throws ResourceNotFoundException if any category ID doesn't exist
     */
    private void validateCategoryIdsExist(List<UpdateOrderDtoRequest> orderChanges, List<Long> categoryIds) {
        Set<Long> existingIds = getExistingCategoryIds(categoryIds);
        List<Long> missingIds = findMissingIds(categoryIds, existingIds);
        
        if (!missingIds.isEmpty()) {
            throw new ResourceNotFoundException(
                String.format(CATEGORIES_NOT_FOUND_MSG, missingIds.size(), missingIds)
            );
        }
    }
    
    /**
     * Get existing category IDs from database in a single batch query.
     * 
     * @param requestedIds list of IDs to check
     * @return set of existing category IDs
     */
    private Set<Long> getExistingCategoryIds(List<Long> requestedIds) {
        return categoryRepository.findAllById(requestedIds).stream()
                .map(Category::getId)
                .collect(Collectors.toSet());
    }
    
    /**
     * Find IDs that don't exist in the database.
     * 
     * @param requestedIds list of requested IDs
     * @param existingIds set of existing IDs
     * @return list of missing IDs
     */
    private List<Long> findMissingIds(List<Long> requestedIds, Set<Long> existingIds) {
        return requestedIds.stream()
                .filter(id -> !existingIds.contains(id))
                .toList();
    }
    

    /**
     * Validate that newOrder values are unique and sequential starting from 1.
     * Ensures data integrity for category ordering.
     *
     * @param orderChanges list of order changes to validate
     * @throws IllegalArgumentException if newOrder values are invalid
     */
    private void validateOrderValues(List<UpdateOrderDtoRequest> orderChanges) {
        // Extract the new order values (no need to sort - sum is order-independent)
        List<Integer> orderValues = orderChanges.stream()
                .map(UpdateOrderDtoRequest::getNewOrder)
                .toList();
        
        // Validate using mathematical approach: sum of sequential numbers 1+2+...+n = n(n+1)/2
        int n = orderValues.size();
        int expectedSum = n * (n + 1) / 2;  // Sum of 1+2+3+...+n
        int actualSum = orderValues.stream().mapToInt(Integer::intValue).sum();
        
        if (actualSum != expectedSum) {
            throw new InvalidCategoryOrderException(n);
        }
    }
    

    /**
     * Update the sortOrder for categories based on the order changes.
     * Uses efficient batch operations and lookup maps for optimal performance.
     *
     * @param orderChanges list of order changes to apply
     * @return list of updated category entities ready for persistence
     */
    private List<Category> updateCategorySortOrders(List<UpdateOrderDtoRequest> orderChanges, List<Long> categoryIds) {
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        Map<Long, Integer> orderLookupMap = createOrderLookupMap(orderChanges);
        
        // Update sortOrder for each category using efficient map lookup
        categories.forEach(category -> {
            Integer newOrder = orderLookupMap.get(category.getId());
            category.setSortOrder(newOrder);
        });
        
        return categories;
    }

}

