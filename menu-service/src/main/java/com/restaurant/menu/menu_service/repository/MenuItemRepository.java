package com.restaurant.menu.menu_service.repository;

import com.restaurant.menu.menu_service.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data repository for {@link com.restaurant.menu.menu_service.entity.MenuItem} aggregates.
 */
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryId(Long categoryId);
    List<MenuItem> findByIsAvailable(Boolean isAvailable);
    List<MenuItem> findByCategoryIdAndIsAvailable(Long categoryId, Boolean isAvailable);


}
