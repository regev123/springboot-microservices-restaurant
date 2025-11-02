package com.restaurant.menu.menu_service.repository;

import com.restaurant.menu.menu_service.entity.KitchenStation;
import com.restaurant.menu.menu_service.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for {@link com.restaurant.menu.menu_service.entity.KitchenStation} aggregates.
 */
public interface KitchenStationRepository extends JpaRepository<KitchenStation, Long> {
    
    /**
     * Find all active kitchen stations.
     */
    List<KitchenStation> findByIsActiveTrue();
    
    /**
     * Find kitchen station by name (case insensitive).
     */
    Optional<KitchenStation> findByNameIgnoreCase(String name);
    
    /**
     * Check if a kitchen station with the given name exists (case insensitive).
     */
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Check if a kitchen station with the given name exists, excluding the specified ID (case insensitive).
     */
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
    
    /**
     * Find kitchen stations that have menu items assigned to them.
     */
    @Query("SELECT DISTINCT ks FROM KitchenStation ks JOIN ks.menuItems mi WHERE ks.isActive = true")
    List<KitchenStation> findActiveStationsWithMenuItems();
    
    /**
     * Count menu items assigned to a specific kitchen station.
     */
    @Query("SELECT COUNT(mi) FROM MenuItem mi JOIN mi.kitchenStations ks WHERE ks.id = :stationId")
    long countMenuItemsByStationId(@Param("stationId") Long stationId);
    
    /**
     * Get menu items assigned to a specific kitchen station.
     */
    @Query("SELECT DISTINCT mi FROM MenuItem mi JOIN mi.kitchenStations ks WHERE ks.id = :stationId")
    List<MenuItem> getMenuItemsByStationId(@Param("stationId") Long stationId);
    
    /**
     * Find all kitchen stations and eagerly fetch their menu items.
     * This is used during data initialization to avoid LazyInitializationException.
     */
    @Query("SELECT DISTINCT ks FROM KitchenStation ks LEFT JOIN FETCH ks.menuItems")
    List<KitchenStation> findAllWithMenuItems();
}
