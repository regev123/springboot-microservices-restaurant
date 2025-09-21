package com.restaurant.menu.menu_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean isAvailable;
    private Long categoryId;
    private String categoryName;
    private List<String> tags;
    private LocalDateTime updatedAt;
}

