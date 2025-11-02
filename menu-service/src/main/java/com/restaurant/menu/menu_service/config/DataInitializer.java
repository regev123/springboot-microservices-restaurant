package com.restaurant.menu.menu_service.config;

import com.restaurant.menu.menu_service.dto.Category.CategoryDtoResponse;
import com.restaurant.menu.menu_service.dto.MenuItem.CreateMenuItemDtoRequest;
import com.restaurant.menu.menu_service.entity.Ingredient;
import com.restaurant.menu.menu_service.entity.KitchenStation;
import com.restaurant.menu.menu_service.entity.MenuItem;
import com.restaurant.menu.menu_service.service.CategoryService;
import com.restaurant.menu.menu_service.service.MenuItemService;
import com.restaurant.menu.menu_service.service.MenuService;
import com.restaurant.menu.menu_service.repository.KitchenStationRepository;
import com.restaurant.menu.menu_service.repository.MenuItemRepository;
import com.restaurant.menu.menu_service.repository.MenuRepository;
import com.restaurant.menu.menu_service.entity.Menu;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Configuration
public class DataInitializer {

    /**
     * Initializes default categories if none exist.
     *
     * @param categoryService service for creating categories with automatic ordering
     * @return a {@link CommandLineRunner} that seeds the database on startup
     */
    @Bean
    @Order(1)
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
    @Order(2)
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

    /**
     * Initializes default menu items if none exist.
     * Creates diverse menu items across all categories with realistic ingredients.
     *
     * @param menuItemService service for creating menu items
     * @param categoryService service for retrieving categories
     * @return a {@link CommandLineRunner} that seeds the database on startup
     */
    @Bean
    @Order(3)
    public CommandLineRunner initMenuItems(MenuItemService menuItemService, CategoryService categoryService) {
        // -----------------------------------------------------------------
        // Seeder: Menu Items
        // -----------------------------------------------------------------
        return args -> {
            // Check if menu items already exist
            if (menuItemService.getMenuItems().isEmpty()) {
                List<CategoryDtoResponse> categories = categoryService.getAllCategories();
                
                if (categories.isEmpty()) {
                    System.err.println("ERROR: No categories found! Menu items cannot be created without categories.");
                    return;
                }
                
                System.out.println("Found " + categories.size() + " categories. Creating menu items...");
                
                // Create menu items for each category
                createMenuItemsForCategories(menuItemService, categories);
                
                // Verify creation
                int createdItems = menuItemService.getMenuItems().size();
                System.out.println("Default menu items initialized: " + createdItems + " items created across all categories");
            } else {
                int existingItems = menuItemService.getMenuItems().size();
                System.out.println("Menu items already exist (" + existingItems + " items), skipping initialization.");
            }
        };
    }

    /**
     * Creates menu items for all available categories.
     * Each category gets 2-4 representative menu items with realistic ingredients.
     */
    private void createMenuItemsForCategories(MenuItemService menuItemService, 
                                            List<CategoryDtoResponse> categories) {
        
        for (CategoryDtoResponse category : categories) {
            String categoryName = category.getName();
            Long categoryId = category.getId();
            
            switch (categoryName.toLowerCase()) {
                case "starters":
                    createStarterItems(menuItemService, categoryId);
                    break;
                case "mains":
                    createMainItems(menuItemService, categoryId);
                    break;
                case "desserts":
                    createDessertItems(menuItemService, categoryId);
                    break;
                case "drinks":
                    createDrinkItems(menuItemService, categoryId);
                    break;
                case "salads":
                    createSaladItems(menuItemService, categoryId);
                    break;
                case "soups":
                    createSoupItems(menuItemService, categoryId);
                    break;
                case "sandwiches":
                    createSandwichItems(menuItemService, categoryId);
                    break;
                case "pizza":
                    createPizzaItems(menuItemService, categoryId);
                    break;
                case "pasta":
                    createPastaItems(menuItemService, categoryId);
                    break;
                case "seafood":
                    createSeafoodItems(menuItemService, categoryId);
                    break;
                case "steaks & grill":
                    createSteakItems(menuItemService, categoryId);
                    break;
                case "vegan":
                    createVeganItems(menuItemService, categoryId);
                    break;
                case "vegetarian":
                    createVegetarianItems(menuItemService, categoryId);
                    break;
                case "kids menu":
                    createKidsItems(menuItemService, categoryId);
                    break;
                case "breakfast":
                    createBreakfastItems(menuItemService, categoryId);
                    break;
                default:
                    // Create a generic item for any other categories
                    createGenericItem(menuItemService, categoryId, categoryName);
                    break;
            }
        }
    }

    /**
     * Initializes default kitchen stations if none exist.
     * Creates 7 kitchen stations and assigns menu items to them based on preparation type.
     *
     * @param kitchenStationService service for creating kitchen stations
     * @param menuItemService service for retrieving menu items
     * @param kitchenStationRepository repository for kitchen station operations
     * @param menuItemRepository repository for menu item operations
     * @return a {@link CommandLineRunner} that seeds the database on startup
     */
    @Bean
    @Order(4)
    public CommandLineRunner initKitchenStations(KitchenStationRepository kitchenStationRepository,
                                                MenuItemRepository menuItemRepository) {
        // -----------------------------------------------------------------
        // Seeder: Kitchen Stations
        // -----------------------------------------------------------------
        return args -> {
            // Check if kitchen stations already exist
            if (kitchenStationRepository.count() == 0) {
                System.out.println("Creating default kitchen stations...");
                
                // Create 7 kitchen stations
                createKitchenStations(kitchenStationRepository);
                
                // Assign menu items to kitchen stations
                assignMenuItemsToStations(kitchenStationRepository, menuItemRepository);
                
                System.out.println("Default kitchen stations initialized with menu item assignments");
            } else {
                long existingStations = kitchenStationRepository.count();
                System.out.println("Kitchen stations already exist (" + existingStations + " stations), skipping initialization.");
            }
        };
    }

    /**
     * Creates 7 kitchen stations with different preparation types.
     */
    private void createKitchenStations(KitchenStationRepository kitchenStationRepository) {
        String[][] stationData = {
            {"Grill Station", "true"},
            {"Salad Station", "true"},
            {"Dessert Station", "true"},
            {"Drink Station", "true"},
            {"Pizza Station", "true"},
            {"Pasta Station", "true"},
            {"Fryer Station", "true"}
        };
        
        for (String[] data : stationData) {
            try {
                KitchenStation station = KitchenStation.builder()
                    .name(data[0])
                    .isActive(Boolean.parseBoolean(data[1]))
                    .build();
                
                kitchenStationRepository.saveAndFlush(station);
                System.out.println("Created kitchen station: " + data[0]);
            } catch (Exception e) {
                System.err.println("Failed to create kitchen station '" + data[0] + "': " + e.getMessage());
            }
        }
    }

    /**
     * Assigns menu items to appropriate kitchen stations based on preparation type.
     */
    @Transactional
    private void assignMenuItemsToStations(KitchenStationRepository kitchenStationRepository, 
                                          MenuItemRepository menuItemRepository) {
        // Get all kitchen stations with their menu items eagerly fetched
        // Using JOIN FETCH to avoid LazyInitializationException with LAZY fetch type
        List<KitchenStation> stations = kitchenStationRepository.findAllWithMenuItems();
        List<MenuItem> menuItems = menuItemRepository.findAll();
        
        if (stations.isEmpty() || menuItems.isEmpty()) {
            System.err.println("No stations or menu items found for assignment");
            return;
        }
        
        // Create station maps for easy lookup
        Map<String, KitchenStation> stationMap = stations.stream()
            .collect(Collectors.toMap(KitchenStation::getName, station -> station));
        
        // Assign menu items to stations based on their names/descriptions
        for (MenuItem menuItem : menuItems) {
            String itemName = menuItem.getName().toLowerCase();
            String description = menuItem.getDescription() != null ? menuItem.getDescription().toLowerCase() : "";
            
            List<KitchenStation> assignedStations = new ArrayList<>();
            
            // Grill Station - grilled items, steaks, burgers
            if (itemName.contains("grilled") || itemName.contains("steak") || itemName.contains("burger") || 
                itemName.contains("ribeye") || itemName.contains("tenderloin") || itemName.contains("bbq")) {
                assignedStations.add(stationMap.get("Grill Station"));
            }
            
            // Salad Station - salads, fresh vegetables
            if (itemName.contains("salad") || itemName.contains("caesar") || itemName.contains("greek") || 
                description.contains("fresh") || description.contains("lettuce")) {
                assignedStations.add(stationMap.get("Salad Station"));
            }
            
            // Dessert Station - desserts, sweet items
            if (itemName.contains("dessert") || itemName.contains("cake") || itemName.contains("tiramisu") || 
                itemName.contains("pancakes") || itemName.contains("ice cream")) {
                assignedStations.add(stationMap.get("Dessert Station"));
            }
            
            // Drink Station - beverages, drinks
            if (itemName.contains("juice") || itemName.contains("wine") || itemName.contains("drink") || 
                description.contains("beverage")) {
                assignedStations.add(stationMap.get("Drink Station"));
            }
            
            // Pizza Station - pizzas
            if (itemName.contains("pizza") || itemName.contains("margherita") || itemName.contains("pepperoni")) {
                assignedStations.add(stationMap.get("Pizza Station"));
            }
            
            // Pasta Station - pasta dishes
            if (itemName.contains("pasta") || itemName.contains("spaghetti") || itemName.contains("fettuccine") || 
                itemName.contains("lasagna") || itemName.contains("carbonara")) {
                assignedStations.add(stationMap.get("Pasta Station"));
            }
            
            // Fryer Station - fried items, wings, fish and chips
            if (itemName.contains("wings") || itemName.contains("fried") || itemName.contains("fish and chips") || 
                itemName.contains("tenders") || description.contains("crispy")) {
                assignedStations.add(stationMap.get("Fryer Station"));
            }
            
            // If no specific station found, assign to Grill Station as default
            if (assignedStations.isEmpty()) {
                assignedStations.add(stationMap.get("Grill Station"));
            }
            
            // Assign the menu item to the stations (from KitchenStation side since it's the owner)
            for (KitchenStation station : assignedStations) {
                // Collections are already initialized, just add the item
                station.getMenuItems().add(menuItem);
            }
            
            System.out.println("Assigned '" + menuItem.getName() + "' to " + 
                assignedStations.stream().map(KitchenStation::getName).collect(Collectors.joining(", ")));
        }
        
        // Save all kitchen stations with their assigned menu items
        for (KitchenStation station : stations) {
            // Explicitly set menuItemsCount before saving
            station.setMenuItemsCount(station.getMenuItems().size());
            
            // Save the station with the updated count
            kitchenStationRepository.save(station);
        }
        
        System.out.println("All kitchen station assignments completed successfully");
    }

    /**
     * Initializes menu item assignments to menus if none exist.
     * Assigns menu items to appropriate menus based on their category and name.
     *
     * @param menuRepository repository for menu operations
     * @param menuItemRepository repository for menu item operations
     * @return a {@link CommandLineRunner} that seeds the database on startup
     */
    @Bean
    @Order(5)
    public CommandLineRunner initMenuAssignments(MenuRepository menuRepository,
                                                MenuItemRepository menuItemRepository) {
        // -----------------------------------------------------------------
        // Seeder: Menu Item Assignments to Menus
        // -----------------------------------------------------------------
        return args -> {
            List<Menu> menus = menuRepository.findAllWithMenuItems();
            List<MenuItem> menuItems = menuItemRepository.findAll();
            
            // Check if any menu already has menu items assigned
            boolean hasAssignments = menus.stream()
                .anyMatch(menu -> menu.getMenuItems() != null && !menu.getMenuItems().isEmpty());
            
            if (hasAssignments) {
                System.out.println("Menu items already assigned to menus, skipping initialization.");
                return;
            }
            
            if (menus.isEmpty() || menuItems.isEmpty()) {
                System.out.println("No menus or menu items found for assignment");
                return;
            }
            
            System.out.println("Assigning menu items to menus...");
            
            // Assign menu items to menus
            assignMenuItemsToMenus(menuRepository, menuItemRepository);
            
            System.out.println("All menu item assignments completed successfully");
        };
    }

    /**
     * Assigns menu items to appropriate menus based on their category and name.
     */
    @Transactional
    private void assignMenuItemsToMenus(MenuRepository menuRepository, 
                                       MenuItemRepository menuItemRepository) {
        // Get all menus with their menu items eagerly fetched
        List<Menu> menus = menuRepository.findAllWithMenuItems();
        List<MenuItem> menuItems = menuItemRepository.findAll();
        
        if (menus.isEmpty() || menuItems.isEmpty()) {
            System.err.println("No menus or menu items found for assignment");
            return;
        }
        
        // Create menu maps for easy lookup
        Map<String, Menu> menuMap = menus.stream()
            .collect(Collectors.toMap(Menu::getName, menu -> menu));
        
        // Assign menu items to menus based on their categories and names
        for (MenuItem menuItem : menuItems) {
            String itemName = menuItem.getName().toLowerCase();
            String categoryName = menuItem.getCategory() != null ? menuItem.getCategory().getName().toLowerCase() : "";
            
            List<Menu> assignedMenus = new ArrayList<>();
            
            // Breakfast Menu - breakfast items, pancakes, eggs
            if (categoryName.contains("breakfast") || itemName.contains("pancake") || 
                itemName.contains("eggs") || itemName.contains("breakfast")) {
                Menu breakfastMenu = menuMap.get("Breakfast Menu");
                if (breakfastMenu != null) {
                    assignedMenus.add(breakfastMenu);
                }
            }
            
            // Lunch Menu - salads, sandwiches, soups, some mains
            if (categoryName.contains("salad") || categoryName.contains("sandwich") || 
                categoryName.contains("soup") || 
                (categoryName.contains("main") && !itemName.contains("steak") && !itemName.contains("ribeye"))) {
                Menu lunchMenu = menuMap.get("Lunch Menu");
                if (lunchMenu != null && !assignedMenus.contains(lunchMenu)) {
                    assignedMenus.add(lunchMenu);
                }
            }
            
            // Dinner Menu - mains, steaks, seafood, pasta, pizza
            if (categoryName.contains("main") || categoryName.contains("steaks") || 
                categoryName.contains("seafood") || categoryName.contains("pasta") || 
                categoryName.contains("pizza") || itemName.contains("steak") || 
                itemName.contains("ribeye") || itemName.contains("tenderloin") ||
                itemName.contains("salmon") || itemName.contains("scampi")) {
                Menu dinnerMenu = menuMap.get("Dinner Menu");
                if (dinnerMenu != null && !assignedMenus.contains(dinnerMenu)) {
                    assignedMenus.add(dinnerMenu);
                }
            }
            
            // Drinks Menu - drinks, beverages
            if (categoryName.contains("drink") || itemName.contains("juice") || 
                itemName.contains("wine") || itemName.contains("drink")) {
                Menu drinksMenu = menuMap.get("Drinks Menu");
                if (drinksMenu != null) {
                    assignedMenus.add(drinksMenu);
                }
            }
            
            // Specials Menu - starters, desserts, some unique items
            if (categoryName.contains("starter") || categoryName.contains("dessert") || 
                itemName.contains("buffalo") || itemName.contains("bruschetta") ||
                itemName.contains("tiramisu") || itemName.contains("chocolate lava")) {
                Menu specialsMenu = menuMap.get("Specials Menu");
                if (specialsMenu != null && !assignedMenus.contains(specialsMenu)) {
                    assignedMenus.add(specialsMenu);
                }
            }
            
            // If no specific menu found, assign to Lunch Menu as default
            if (assignedMenus.isEmpty()) {
                Menu lunchMenu = menuMap.get("Lunch Menu");
                if (lunchMenu != null) {
                    assignedMenus.add(lunchMenu);
                }
            }
            
            // Assign the menu item to the menus (from Menu side since it's the owner)
            for (Menu menu : assignedMenus) {
                if (menu.getMenuItems() == null) {
                    menu.setMenuItems(new ArrayList<>());
                }
                if (!menu.getMenuItems().contains(menuItem)) {
                    menu.getMenuItems().add(menuItem);
                }
            }
            
            System.out.println("Assigned '" + menuItem.getName() + "' to " + 
                assignedMenus.stream().map(Menu::getName).collect(Collectors.joining(", ")));
        }
        
        // Save all menus with their assigned menu items
        for (Menu menu : menus) {
            menuRepository.save(menu);
        }
        
        System.out.println("All menu assignments completed successfully");
    }

    // ==================== CATEGORY-SPECIFIC MENU ITEM CREATORS ====================

    private void createStarterItems(MenuItemService menuItemService, Long categoryId) {
        // Buffalo Wings
        createMenuItem(menuItemService, categoryId, "Buffalo Wings", 
            "Crispy chicken wings tossed in spicy buffalo sauce", 
            new BigDecimal("12.99"), true,
            Set.of(
                new Ingredient("Chicken Wings", false),
                new Ingredient("Buffalo Sauce", false),
                new Ingredient("Celery Sticks", true),
                new Ingredient("Blue Cheese Dip", true)
            ));

        // Bruschetta
        createMenuItem(menuItemService, categoryId, "Bruschetta", 
            "Toasted bread topped with fresh tomatoes, basil, and garlic", 
            new BigDecimal("8.99"), true,
            Set.of(
                new Ingredient("Bread", false),
                new Ingredient("Tomatoes", false),
                new Ingredient("Basil", false),
                new Ingredient("Garlic", false),
                new Ingredient("Olive Oil", false)
            ));
    }

    private void createMainItems(MenuItemService menuItemService, Long categoryId) {
        // Grilled Salmon
        createMenuItem(menuItemService, categoryId, "Grilled Salmon", 
            "Fresh Atlantic salmon grilled to perfection with herbs", 
            new BigDecimal("24.99"), true,
            Set.of(
                new Ingredient("Salmon Fillet", false),
                new Ingredient("Lemon", false),
                new Ingredient("Dill", false),
                new Ingredient("Butter", true),
                new Ingredient("Asparagus", true)
            ));

        // Beef Tenderloin
        createMenuItem(menuItemService, categoryId, "Beef Tenderloin", 
            "8oz center-cut beef tenderloin with red wine reduction", 
            new BigDecimal("32.99"), true,
            Set.of(
                new Ingredient("Beef Tenderloin", false),
                new Ingredient("Red Wine", false),
                new Ingredient("Mushrooms", true),
                new Ingredient("Garlic", false),
                new Ingredient("Rosemary", false)
            ));
    }

    private void createDessertItems(MenuItemService menuItemService, Long categoryId) {
        // Chocolate Lava Cake
        createMenuItem(menuItemService, categoryId, "Chocolate Lava Cake", 
            "Warm chocolate cake with molten center, served with vanilla ice cream", 
            new BigDecimal("9.99"), true,
            Set.of(
                new Ingredient("Dark Chocolate", false),
                new Ingredient("Butter", false),
                new Ingredient("Eggs", false),
                new Ingredient("Sugar", false),
                new Ingredient("Vanilla Ice Cream", false)
            ));

        // Tiramisu
        createMenuItem(menuItemService, categoryId, "Tiramisu", 
            "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone", 
            new BigDecimal("8.99"), true,
            Set.of(
                new Ingredient("Ladyfingers", false),
                new Ingredient("Mascarpone", false),
                new Ingredient("Coffee", false),
                new Ingredient("Cocoa Powder", false),
                new Ingredient("Marsala Wine", false)
            ));
    }

    private void createDrinkItems(MenuItemService menuItemService, Long categoryId) {
        // Fresh Orange Juice
        createMenuItem(menuItemService, categoryId, "Fresh Orange Juice", 
            "Freshly squeezed orange juice", 
            new BigDecimal("4.99"), true,
            Set.of(
                new Ingredient("Fresh Oranges", false),
                new Ingredient("Ice", true)
            ));

        // House Red Wine
        createMenuItem(menuItemService, categoryId, "House Red Wine", 
            "Premium house red wine selection", 
            new BigDecimal("8.99"), true,
            Set.of(
                new Ingredient("Red Wine", false)
            ));
    }

    private void createSaladItems(MenuItemService menuItemService, Long categoryId) {
        // Caesar Salad
        createMenuItem(menuItemService, categoryId, "Caesar Salad", 
            "Crisp romaine lettuce with parmesan cheese and croutons", 
            new BigDecimal("11.99"), true,
            Set.of(
                new Ingredient("Romaine Lettuce", false),
                new Ingredient("Parmesan Cheese", false),
                new Ingredient("Croutons", false),
                new Ingredient("Caesar Dressing", false),
                new Ingredient("Anchovies", true)
            ));

        // Greek Salad
        createMenuItem(menuItemService, categoryId, "Greek Salad", 
            "Fresh vegetables with feta cheese and olive oil dressing", 
            new BigDecimal("10.99"), true,
            Set.of(
                new Ingredient("Tomatoes", false),
                new Ingredient("Cucumbers", false),
                new Ingredient("Feta Cheese", false),
                new Ingredient("Olives", false),
                new Ingredient("Red Onion", true)
            ));
    }

    private void createSoupItems(MenuItemService menuItemService, Long categoryId) {
        // Tomato Basil Soup
        createMenuItem(menuItemService, categoryId, "Tomato Basil Soup", 
            "Creamy tomato soup with fresh basil", 
            new BigDecimal("7.99"), true,
            Set.of(
                new Ingredient("Tomatoes", false),
                new Ingredient("Basil", false),
                new Ingredient("Cream", false),
                new Ingredient("Garlic", false),
                new Ingredient("Croutons", true)
            ));

        // Chicken Noodle Soup
        createMenuItem(menuItemService, categoryId, "Chicken Noodle Soup", 
            "Homemade chicken soup with egg noodles", 
            new BigDecimal("8.99"), true,
            Set.of(
                new Ingredient("Chicken", false),
                new Ingredient("Egg Noodles", false),
                new Ingredient("Carrots", false),
                new Ingredient("Celery", false),
                new Ingredient("Onions", false)
            ));
    }

    private void createSandwichItems(MenuItemService menuItemService, Long categoryId) {
        // Club Sandwich
        createMenuItem(menuItemService, categoryId, "Club Sandwich", 
            "Triple-decker sandwich with turkey, bacon, and avocado", 
            new BigDecimal("13.99"), true,
            Set.of(
                new Ingredient("Turkey", false),
                new Ingredient("Bacon", false),
                new Ingredient("Avocado", false),
                new Ingredient("Lettuce", false),
                new Ingredient("Tomato", false),
                new Ingredient("Mayo", true)
            ));

        // Grilled Chicken Panini
        createMenuItem(menuItemService, categoryId, "Grilled Chicken Panini", 
            "Grilled chicken with mozzarella and pesto on artisan bread", 
            new BigDecimal("12.99"), true,
            Set.of(
                new Ingredient("Chicken Breast", false),
                new Ingredient("Mozzarella", false),
                new Ingredient("Pesto", false),
                new Ingredient("Artisan Bread", false),
                new Ingredient("Tomatoes", true)
            ));
    }

    private void createPizzaItems(MenuItemService menuItemService, Long categoryId) {
        // Margherita Pizza
        createMenuItem(menuItemService, categoryId, "Margherita Pizza", 
            "Classic pizza with tomato sauce, mozzarella, and fresh basil", 
            new BigDecimal("16.99"), true,
            Set.of(
                new Ingredient("Pizza Dough", false),
                new Ingredient("Tomato Sauce", false),
                new Ingredient("Mozzarella", false),
                new Ingredient("Fresh Basil", false),
                new Ingredient("Olive Oil", false)
            ));

        // Pepperoni Pizza
        createMenuItem(menuItemService, categoryId, "Pepperoni Pizza", 
            "Traditional pizza topped with pepperoni and mozzarella", 
            new BigDecimal("18.99"), true,
            Set.of(
                new Ingredient("Pizza Dough", false),
                new Ingredient("Tomato Sauce", false),
                new Ingredient("Mozzarella", false),
                new Ingredient("Pepperoni", false),
                new Ingredient("Oregano", false)
            ));
    }

    private void createPastaItems(MenuItemService menuItemService, Long categoryId) {
        // Spaghetti Carbonara
        createMenuItem(menuItemService, categoryId, "Spaghetti Carbonara", 
            "Classic Italian pasta with eggs, cheese, and pancetta", 
            new BigDecimal("17.99"), true,
            Set.of(
                new Ingredient("Spaghetti", false),
                new Ingredient("Eggs", false),
                new Ingredient("Parmesan", false),
                new Ingredient("Pancetta", false),
                new Ingredient("Black Pepper", false)
            ));

        // Fettuccine Alfredo
        createMenuItem(menuItemService, categoryId, "Fettuccine Alfredo", 
            "Creamy fettuccine with parmesan and butter sauce", 
            new BigDecimal("15.99"), true,
            Set.of(
                new Ingredient("Fettuccine", false),
                new Ingredient("Heavy Cream", false),
                new Ingredient("Parmesan", false),
                new Ingredient("Butter", false),
                new Ingredient("Garlic", true)
            ));
    }

    private void createSeafoodItems(MenuItemService menuItemService, Long categoryId) {
        // Fish and Chips
        createMenuItem(menuItemService, categoryId, "Fish and Chips", 
            "Beer-battered cod with crispy fries", 
            new BigDecimal("19.99"), true,
            Set.of(
                new Ingredient("Cod Fillet", false),
                new Ingredient("Beer Batter", false),
                new Ingredient("Potatoes", false),
                new Ingredient("Tartar Sauce", false),
                new Ingredient("Lemon", true)
            ));

        // Shrimp Scampi
        createMenuItem(menuItemService, categoryId, "Shrimp Scampi", 
            "Large shrimp sautéed in garlic butter and white wine", 
            new BigDecimal("22.99"), true,
            Set.of(
                new Ingredient("Large Shrimp", false),
                new Ingredient("Garlic", false),
                new Ingredient("Butter", false),
                new Ingredient("White Wine", false),
                new Ingredient("Lemon", false)
            ));
    }

    private void createSteakItems(MenuItemService menuItemService, Long categoryId) {
        // Ribeye Steak
        createMenuItem(menuItemService, categoryId, "Ribeye Steak", 
            "12oz ribeye steak grilled to your preference", 
            new BigDecimal("34.99"), true,
            Set.of(
                new Ingredient("Ribeye Steak", false),
                new Ingredient("Salt", false),
                new Ingredient("Black Pepper", false),
                new Ingredient("Garlic Butter", true),
                new Ingredient("Herbs", false)
            ));

        // BBQ Ribs
        createMenuItem(menuItemService, categoryId, "BBQ Ribs", 
            "Slow-cooked pork ribs with house BBQ sauce", 
            new BigDecimal("26.99"), true,
            Set.of(
                new Ingredient("Pork Ribs", false),
                new Ingredient("BBQ Sauce", false),
                new Ingredient("Brown Sugar", false),
                new Ingredient("Smoked Paprika", false),
                new Ingredient("Coleslaw", true)
            ));
    }

    private void createVeganItems(MenuItemService menuItemService, Long categoryId) {
        // Vegan Buddha Bowl
        createMenuItem(menuItemService, categoryId, "Vegan Buddha Bowl", 
            "Quinoa bowl with roasted vegetables and tahini dressing", 
            new BigDecimal("14.99"), true,
            Set.of(
                new Ingredient("Quinoa", false),
                new Ingredient("Roasted Vegetables", false),
                new Ingredient("Chickpeas", false),
                new Ingredient("Tahini", false),
                new Ingredient("Avocado", true)
            ));

        // Vegan Burger
        createMenuItem(menuItemService, categoryId, "Vegan Burger", 
            "Plant-based patty with lettuce, tomato, and vegan mayo", 
            new BigDecimal("13.99"), true,
            Set.of(
                new Ingredient("Plant-based Patty", false),
                new Ingredient("Lettuce", false),
                new Ingredient("Tomato", false),
                new Ingredient("Vegan Mayo", false),
                new Ingredient("Vegan Bun", false)
            ));
    }

    private void createVegetarianItems(MenuItemService menuItemService, Long categoryId) {
        // Vegetarian Lasagna
        createMenuItem(menuItemService, categoryId, "Vegetarian Lasagna", 
            "Layers of pasta with ricotta, spinach, and marinara sauce", 
            new BigDecimal("16.99"), true,
            Set.of(
                new Ingredient("Lasagna Noodles", false),
                new Ingredient("Ricotta Cheese", false),
                new Ingredient("Spinach", false),
                new Ingredient("Marinara Sauce", false),
                new Ingredient("Mozzarella", false)
            ));

        // Portobello Mushroom Burger
        createMenuItem(menuItemService, categoryId, "Portobello Mushroom Burger", 
            "Grilled portobello mushroom with cheese and vegetables", 
            new BigDecimal("12.99"), true,
            Set.of(
                new Ingredient("Portobello Mushroom", false),
                new Ingredient("Swiss Cheese", false),
                new Ingredient("Lettuce", false),
                new Ingredient("Tomato", false),
                new Ingredient("Brioche Bun", false)
            ));
    }

    private void createKidsItems(MenuItemService menuItemService, Long categoryId) {
        // Kids Chicken Tenders
        createMenuItem(menuItemService, categoryId, "Kids Chicken Tenders", 
            "Crispy chicken tenders with fries and ketchup", 
            new BigDecimal("8.99"), true,
            Set.of(
                new Ingredient("Chicken Tenders", false),
                new Ingredient("French Fries", false),
                new Ingredient("Ketchup", false),
                new Ingredient("Honey Mustard", true)
            ));

        // Kids Mac and Cheese
        createMenuItem(menuItemService, categoryId, "Kids Mac and Cheese", 
            "Creamy macaroni and cheese with steamed broccoli", 
            new BigDecimal("7.99"), true,
            Set.of(
                new Ingredient("Macaroni", false),
                new Ingredient("Cheddar Cheese", false),
                new Ingredient("Milk", false),
                new Ingredient("Butter", false),
                new Ingredient("Broccoli", true)
            ));
    }

    private void createBreakfastItems(MenuItemService menuItemService, Long categoryId) {
        // Pancakes
        createMenuItem(menuItemService, categoryId, "Pancakes", 
            "Fluffy pancakes with maple syrup and butter", 
            new BigDecimal("9.99"), true,
            Set.of(
                new Ingredient("Pancake Mix", false),
                new Ingredient("Maple Syrup", false),
                new Ingredient("Butter", false),
                new Ingredient("Berries", true),
                new Ingredient("Whipped Cream", true)
            ));

        // Eggs Benedict
        createMenuItem(menuItemService, categoryId, "Eggs Benedict", 
            "Poached eggs on English muffin with hollandaise sauce", 
            new BigDecimal("13.99"), true,
            Set.of(
                new Ingredient("Eggs", false),
                new Ingredient("English Muffin", false),
                new Ingredient("Canadian Bacon", false),
                new Ingredient("Hollandaise Sauce", false),
                new Ingredient("Chives", false)
            ));
    }

    private void createGenericItem(MenuItemService menuItemService, Long categoryId, String categoryName) {
        createMenuItem(menuItemService, categoryId, categoryName + " Special", 
            "Our signature " + categoryName.toLowerCase() + " dish", 
            new BigDecimal("15.99"), true,
            Set.of(
                new Ingredient("Main Ingredient", false),
                new Ingredient("Seasoning", false),
                new Ingredient("Garnish", true)
            ));
    }

    /**
     * Helper method to create a menu item with error handling.
     */
    private void createMenuItem(MenuItemService menuItemService, Long categoryId, String name, 
                              String description, BigDecimal price, Boolean isAvailable, Set<Ingredient> ingredients) {
        try {
            CreateMenuItemDtoRequest request = new CreateMenuItemDtoRequest();
            request.setCategoryId(categoryId);
            request.setName(name);
            request.setDescription(description);
            request.setPrice(price);
            request.setIsAvailable(isAvailable);
            request.setIngredients(ingredients);
            
            menuItemService.createMenuItem(request);
            System.out.println("Created menu item: " + name + " (Category ID: " + categoryId + ")");
        } catch (Exception e) {
            System.err.println("Failed to create menu item '" + name + "' (Category ID: " + categoryId + "): " + e.getMessage());
            e.printStackTrace(); // Print full stack trace for debugging
        }
    }
}
