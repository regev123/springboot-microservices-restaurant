package com.restaurant.menu.menu_service.repository;

import com.restaurant.menu.menu_service.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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
    
    /**
     * Find a category by ID and eagerly fetch its menu items.
     * This is used during deletion to ensure all menu items are loaded.
     */
    @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.menuItems WHERE c.id = :id")
    Optional<Category> findByIdWithMenuItems(@Param("id") Long id);
}

