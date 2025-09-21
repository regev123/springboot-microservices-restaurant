package com.restaurant.menu.menu_service.repository;

import com.restaurant.menu.menu_service.entity.Menu;
import com.restaurant.menu.menu_service.entity.MenuStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByStatus(MenuStatus status);

    @Modifying
    @Query("UPDATE Menu m SET m.status = :status")
    void updateStatusForAll(@Param("status") MenuStatus status);
}
