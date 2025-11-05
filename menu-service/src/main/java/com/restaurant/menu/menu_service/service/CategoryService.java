package com.restaurant.menu.menu_service.service;


import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.Category.CategoryDtoResponse;
import com.restaurant.menu.menu_service.dto.Category.UpdateOrderDtoRequest;
import com.restaurant.menu.menu_service.entity.Category;
import com.restaurant.menu.menu_service.entity.KitchenStation;
import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuItem;
import com.restaurant.menu.menu_service.exceptions.CategoryAlreadyExistException;
import com.restaurant.menu.menu_service.exceptions.InvalidCategoryOrderException;
import com.restaurant.menu.menu_service.mapper.CategoryMapper;
import com.restaurant.menu.menu_service.repository.CategoryRepository;
import com.restaurant.menu.menu_service.repository.KitchenStationRepository;
import com.restaurant.menu.menu_service.repository.MenuRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
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
    private static final String DUPLICATE_CATEGORY_IDS_MSG = "Duplicate category IDs are not allowed in order updates";
    private static final String CATEGORIES_NO_LONGER_EXIST_MSG = "Some categories no longer exist. Please refresh the page and try again.";

    // ==================== DEPENDENCIES ====================
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final MenuRepository menuRepository;
    private final KitchenStationRepository kitchenStationRepository;

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
     * Update an existing category with new name and description.
     * Validates that the category exists and that the new name is unique (if changed).
     * 
     * @param categoryId the ID of the category to update
     * @param categoryName the new name for the category
     * @param description the new description for the category
     * @return the updated category as DTO
     * @throws ResourceNotFoundException if category doesn't exist
     * @throws CategoryAlreadyExistException if new name conflicts with existing category
     */
    public CategoryDtoResponse updateCategory(Long categoryId, String categoryName, String description) {
        Category existingCategory = findCategoryById(categoryId);
        
        // Check if name is being changed and validate uniqueness
        if (!existingCategory.getName().equalsIgnoreCase(categoryName)) {
            validateCategoryNameUniqueness(categoryName);
            existingCategory.setName(categoryName);
        }
        
        existingCategory.setDescription(description);
        
        Category updatedCategory = categoryRepository.save(existingCategory);
        
        return categoryMapper.toDto(updatedCategory);
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
     * When a category is deleted, all menu items in that category are also deleted
     * (due to orphanRemoval = true). Before deleting, we need to remove those menu items
     * from all menus and kitchen stations that reference them to avoid foreign key constraints.
     * 
     * @param categoryId the ID of the category to delete
     * @throws ResourceNotFoundException if category doesn't exist
     */
    public List<CategoryDtoResponse> deleteCategory(Long categoryId) {
        // Use findByIdWithMenuItems to eagerly fetch menu items
        Category categoryToDelete = findCategoryByIdWithMenuItems(categoryId);
        Integer deletedOrder = categoryToDelete.getSortOrder();
        
        // Get all menu items in this category before deletion
        List<MenuItem> menuItemsToDelete = categoryToDelete.getMenuItems();
        
        // Remove each menu item from all menus and kitchen stations that reference them
        if (menuItemsToDelete != null && !menuItemsToDelete.isEmpty()) {
            removeMenuItemsFromMenusAndStations(menuItemsToDelete);
        }
        
        // Now delete the category (this will cascade delete all menu items via orphanRemoval)
        categoryRepository.deleteById(categoryId);
        reorderCategoriesAfterDeletion(deletedOrder);
        
        // Return all categories after deletion and reordering
        return getAllCategories();
    }
    
    /**
     * Remove menu items from all menus and kitchen stations that reference them.
     * This prevents foreign key constraint violations when menu items are deleted.
     * 
     * @param menuItems the menu items to remove from relationships
     */
    private void removeMenuItemsFromMenusAndStations(List<MenuItem> menuItems) {
        // 1. Remove menu items from all menus that reference them
        List<Menu> menus = menuRepository.findAllWithMenuItems();
        for (Menu menu : menus) {
            if (menu.getMenuItems() != null) {
                boolean modified = menu.getMenuItems().removeAll(menuItems);
                if (modified) {
                    menuRepository.save(menu);
                }
            }
        }
        
        // 2. Remove menu items from all kitchen stations that reference them
        List<KitchenStation> stations = kitchenStationRepository.findAllWithMenuItems();
        for (KitchenStation station : stations) {
            if (station.getMenuItems() != null) {
                boolean modified = station.getMenuItems().removeAll(menuItems);
                if (modified) {
                    kitchenStationRepository.save(station);
                }
            }
        }
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
    
    /**
     * Find a category by ID with menu items eagerly fetched.
     * Used during deletion to ensure all menu items are loaded.
     * 
     * @param categoryId the ID of the category to find
     * @return the found category with menu items loaded
     * @throws ResourceNotFoundException if category doesn't exist
     */
    private Category findCategoryByIdWithMenuItems(Long categoryId) {
        return categoryRepository.findByIdWithMenuItems(categoryId)
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
        
        // Validate input for duplicates
        validateNoDuplicateIds(categoryIds);
        
        // Validate and get existing categories in one database call
        List<Category> existingCategories = validateCategoryIdsExist(orderChanges, categoryIds);
        
        validateOrderValues(orderChanges);
        
        // Use the already fetched categories instead of calling database again
        List<Category> updatedCategories = updateCategorySortOrders(orderChanges, existingCategories);
        
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
     * Validate that there are no duplicate category IDs in the request.
     * 
     * @param categoryIds list of category IDs to validate
     * @throws IllegalArgumentException if duplicate IDs are found
     */
    private void validateNoDuplicateIds(List<Long> categoryIds) {
        Set<Long> uniqueIds = new HashSet<>(categoryIds);
        if (uniqueIds.size() != categoryIds.size()) {
            throw new IllegalArgumentException(DUPLICATE_CATEGORY_IDS_MSG);
        }
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
     * @return list of existing categories for reuse
     * @throws ResourceNotFoundException if any category ID doesn't exist
     */
    private List<Category> validateCategoryIdsExist(List<UpdateOrderDtoRequest> orderChanges, List<Long> categoryIds) {
        List<Category> existingCategories = getExistingCategories(categoryIds);
        
        // Simple check: if sizes don't match, some categories were deleted concurrently
        if (existingCategories.size() != categoryIds.size()) {
            throw new ResourceNotFoundException(
                CATEGORIES_NO_LONGER_EXIST_MSG
            );
        }
        
        return existingCategories; // Return categories for reuse
    }
    
    /**
     * Get existing categories from database in a single batch query.
     * 
     * @param requestedIds list of IDs to check
     * @return list of existing categories
     */
    private List<Category> getExistingCategories(List<Long> requestedIds) {
        return categoryRepository.findAllById(requestedIds);
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
    private List<Category> updateCategorySortOrders(List<UpdateOrderDtoRequest> orderChanges, List<Category> existingCategories) {
        Map<Long, Integer> orderLookupMap = createOrderLookupMap(orderChanges);
        
        // Update sortOrder for each category using efficient map lookup
        existingCategories.forEach(category -> {
            Integer newOrder = orderLookupMap.get(category.getId());
            category.setSortOrder(newOrder);
        });
        
        return existingCategories;
    }

}

