package com.restaurant.menu.menu_service.config;

import com.restaurant.menu.menu_service.service.CategoryService;
import com.restaurant.menu.menu_service.service.MenuService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    /**
     * Initializes default categories if none exist.
     *
     * @param categoryService service for creating categories with automatic ordering
     * @return a {@link CommandLineRunner} that seeds the database on startup
     */
    @Bean
    public CommandLineRunner initCategories(CategoryService categoryService) {
        // -----------------------------------------------------------------
        // Seeder: Categories
        // -----------------------------------------------------------------
        return args -> {
            if (categoryService.getAllCategories().isEmpty()) {
                String[][] categoryData = {
                    {"Starters", "Appetizers and small plates to start your meal"},
                    {"Mains", "Main courses and hearty dishes"},
                    {"Desserts", "Sweet treats to end your meal perfectly"},
                    {"Drinks", "Beverages, cocktails, and refreshments"},
                    {"Salads", "Fresh and healthy salad options"},
                    {"Soups", "Warm and comforting soup selections"},
                    {"Sandwiches", "Delicious sandwiches and wraps"},
                    {"Pizza", "Authentic wood-fired pizzas"},
                    {"Pasta", "Traditional and modern pasta dishes"},
                    {"Seafood", "Fresh seafood and fish specialties"},
                    {"Steaks & Grill", "Premium grilled meats and steaks"},
                    {"Vegan", "Plant-based vegan options"},
                    {"Vegetarian", "Vegetarian-friendly dishes"},
                    {"Kids Menu", "Child-friendly portions and favorites"},
                    {"Breakfast", "Morning favorites and brunch items"}
                };
                
                for (String[] data : categoryData) {
                    categoryService.createCategory(data[0], data[1]);
                }
                System.out.println("Default categories initialized with automatic ordering");
            } else {
                System.out.println("Categories already exist, skipping initialization.");
            }
        };
    }

    /**
     * Initializes default menus if none exist.
     *
     * @param menuService service for creating menus with proper business logic
     * @return a {@link CommandLineRunner} that seeds the database on startup
     */
    @Bean
    public CommandLineRunner initMenus(MenuService menuService) {
        // -----------------------------------------------------------------
        // Seeder: Menus
        // -----------------------------------------------------------------
        return args -> {
            if (menuService.getAllMenus().isEmpty()) {
                String[] menuNames = {
                    "Breakfast Menu",
                    "Lunch Menu", 
                    "Dinner Menu",
                    "Drinks Menu",
                    "Specials Menu"
                };
                
                for (String menuName : menuNames) {
                    try {
                        menuService.createMenu(menuName);
                    } catch (Exception e) {
                        // Log but continue with other menus if one fails
                        System.err.println("Failed to create menu '" + menuName + "': " + e.getMessage());
                    }
                }
                System.out.println("Default menus initialized using MenuService");
            } else {
                System.out.println("Menus already exist, skipping initialization.");
            }
        };
    }
}
