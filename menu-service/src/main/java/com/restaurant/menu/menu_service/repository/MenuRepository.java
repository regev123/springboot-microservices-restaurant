package com.restaurant.menu.menu_service.repository;

import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for {@link com.restaurant.menu.menu_service.entity.Menu} aggregates.
 */
public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByStatus(MenuStatus status);

    boolean existsByNameIgnoreCase(String name);
    
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
    
    @Query("SELECT DISTINCT m FROM Menu m LEFT JOIN FETCH m.menuItems")
    List<Menu> findAllWithMenuItems();
}
