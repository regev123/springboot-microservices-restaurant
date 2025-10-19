package com.restaurant.menu.menu_service.dto.Menu;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO representing an available menu status option.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusDtoResponse {

    /** Menu status name. */
    private String name;
    
    /** Menu status description. */
    private String description;
}
