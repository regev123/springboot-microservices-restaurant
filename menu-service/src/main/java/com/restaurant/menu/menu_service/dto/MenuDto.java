package com.restaurant.menu.menu_service.dto;

import com.restaurant.menu.menu_service.entity.MenuStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuDto {
    private Long id;
    private String name;
    private MenuStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

