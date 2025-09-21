package com.restaurant.menu.menu_service.services;


import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.menu.menu_service.dto.CategoryDto;
import com.restaurant.menu.menu_service.entity.Category;
import com.restaurant.menu.menu_service.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Create new category
     */
    public CategoryDto createCategory(CategoryDto request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException("Category already exists with name: " + request.getName());
        }

        Category category = new Category();
        category.setName(request.getName());

        return toDto(categoryRepository.save(category));
    }

    /**
     * Update category name
     */
    public CategoryDto updateCategory(Long categoryId, CategoryDto request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        category.setName(request.getName());
        return toDto(categoryRepository.save(category));
    }

    /**
     * Delete category
     */
    public void deleteCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with ID: " + categoryId);
        }
        categoryRepository.deleteById(categoryId);
    }

    /**
     * Get category by ID
     */
    public CategoryDto getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
    }

    /**
     * List all categories
     */
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toDto).toList();
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(category.getId(), category.getName());
    }
}

