package com.restaurant.tableorder.table_order_service.config;

import com.restaurant.tableorder.table_order_service.entity.Table;
import com.restaurant.tableorder.table_order_service.entity.TableStatus;
import com.restaurant.tableorder.table_order_service.repository.TableRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

/**
 * Initializes default tables if none exist.
 * Creates 25 restaurant tables with varied capacities and locations.
 */
@Configuration
public class DataInitializer {

    /**
     * Initializes default tables if none exist.
     *
     * @param tableRepository repository for table operations
     * @return a {@link CommandLineRunner} that seeds the database on startup
     */
    @Bean
    @Order(1)
    public CommandLineRunner initTables(TableRepository tableRepository) {
        // -----------------------------------------------------------------
        // Seeder: Tables
        // -----------------------------------------------------------------
        return args -> {
            if (tableRepository.count() == 0) {
                System.out.println("Creating default tables...");
                
                // Create 25 tables with varied capacities and locations
                createTables(tableRepository);
                
                long createdTables = tableRepository.count();
                System.out.println("Default tables initialized: " + createdTables + " tables created");
            } else {
                long existingTables = tableRepository.count();
                System.out.println("Tables already exist (" + existingTables + " tables), skipping initialization.");
            }
        };
    }

    /**
     * Creates 25 restaurant tables with realistic data.
     * Tables are distributed across different locations with varying capacities.
     */
    private void createTables(TableRepository tableRepository) {
        // Table data: [tableNumber, capacity, location]
        Object[][] tableData = {
            // Main Dining Area (Tables 1-10)
            {1, 2, "Main Dining"},
            {2, 4, "Main Dining"},
            {3, 2, "Main Dining"},
            {4, 6, "Main Dining"},
            {5, 4, "Main Dining"},
            {6, 2, "Main Dining"},
            {7, 8, "Main Dining"},
            {8, 4, "Main Dining"},
            {9, 2, "Main Dining"},
            {10, 6, "Main Dining"},
            
            // Window Section (Tables 11-15)
            {11, 2, "Window"},
            {12, 4, "Window"},
            {13, 2, "Window"},
            {14, 4, "Window"},
            {15, 6, "Window"},
            
            // Patio/Outdoor (Tables 16-20)
            {16, 4, "Patio"},
            {17, 6, "Patio"},
            {18, 2, "Patio"},
            {19, 8, "Patio"},
            {20, 4, "Patio"},
            
            // Bar Area (Tables 21-25)
            {21, 2, "Bar"},
            {22, 2, "Bar"},
            {23, 4, "Bar"},
            {24, 2, "Bar"},
            {25, 4, "Bar"}
        };
        
        for (Object[] data : tableData) {
            try {
                Table table = Table.builder()
                    .tableNumber((Integer) data[0])
                    .capacity((Integer) data[1])
                    .location((String) data[2])
                    .status(TableStatus.AVAILABLE)
                    .isActive(true)
                    .build();
                
                tableRepository.save(table);
                System.out.println("Created table #" + data[0] + " - Capacity: " + data[1] + ", Location: " + data[2]);
            } catch (Exception e) {
                System.err.println("Failed to create table #" + data[0] + ": " + e.getMessage());
            }
        }
    }
}

