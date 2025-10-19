package com.restaurant.menu.menu_service.repository;

import com.restaurant.menu.menu_service.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data repository for {@link com.restaurant.menu.menu_service.entity.Category} aggregates.
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Find all categories ordered by sortOrder ascending.
     */
    List<Category> findAllByOrderBySortOrderAsc();
    
    /**
     * Find the category with the highest sortOrder.
     */
    Category findTopByOrderBySortOrderDesc();
    
    /**
     * Find all categories with sortOrder greater than the given value.
     */
    List<Category> findBySortOrderGreaterThan(Integer sortOrder);
}

