package com.restaurant.tableorder.table_order_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.tableorder.table_order_service.dto.Table.ChangeTableStatusDtoRequest;
import com.restaurant.tableorder.table_order_service.dto.Table.CreateTableDtoRequest;
import com.restaurant.tableorder.table_order_service.dto.Table.TableDtoResponse;
import com.restaurant.tableorder.table_order_service.dto.Table.UpdateTableDtoRequest;
import com.restaurant.tableorder.table_order_service.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tables")
@RequiredArgsConstructor
@Tag(name = "Table Management", description = "Endpoints for managing restaurant tables. Admin operations require ADMIN role.")
@SecurityRequirement(name = "Bearer Authentication")
/**
 * REST controller exposing endpoints for managing tables.
 * Follows Single Responsibility Principle by handling only table-related HTTP operations.
 */
public class TableController {

    private final TableService tableService;

    // ---------------------------------------------------------------------
    // Endpoint: Create Table (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Create a new table. Admin only.
     */
    @PostMapping("/admin/create")
    @RequiresRole("ADMIN")
    @Operation(summary = "Create table", description = "Creates a new restaurant table. Requires ADMIN role.")
    public ResponseEntity<TableDtoResponse> createTable(@Valid @RequestBody CreateTableDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tableService.createTable(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Update Table (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Update an existing table. Admin only.
     */
    @PutMapping("/admin/update")
    @RequiresRole("ADMIN")
    @Operation(summary = "Update table", description = "Updates an existing restaurant table. Requires ADMIN role.")
    public ResponseEntity<TableDtoResponse> updateTable(@Valid @RequestBody UpdateTableDtoRequest request) {
        return ResponseEntity.ok(tableService.updateTable(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Delete Table (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Delete a table by ID. Admin only.
     */
    @DeleteMapping("/admin/delete/{tableId}")
    @RequiresRole("ADMIN")
    @Operation(summary = "Delete table", description = "Deletes a table by ID. Requires ADMIN role.")
    public ResponseEntity<Void> deleteTable(@PathVariable("tableId") Long tableId) {
        tableService.deleteTable(tableId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get All Tables (ADMIN)
    // ---------------------------------------------------------------------
    /**
     * Get all tables. Admin only.
     */
    @GetMapping("/admin/all")
    @RequiresRole("ADMIN")
    @Operation(summary = "Get all tables", description = "Gets all tables. Requires ADMIN role.")
    public ResponseEntity<List<TableDtoResponse>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get All Active Tables (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Get all active tables. Available for waitress (USER role).
     */
    @GetMapping("/all")
    @Operation(summary = "Get all active tables", description = "Gets all active tables. Available for waitress (USER role).")
    public ResponseEntity<List<TableDtoResponse>> getAllActiveTables() {
        return ResponseEntity.ok(tableService.getAllActiveTables());
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Table By ID (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Get table details by ID. Available for waitress (USER role).
     * Orders are not loaded by default (lazy fetching).
     */
    @GetMapping("/{tableId}")
    @Operation(summary = "Get table by ID", description = "Gets table details by ID. Orders are not loaded by default. Available for waitress (USER role).")
    public ResponseEntity<TableDtoResponse> getTableById(@PathVariable("tableId") Long tableId) {
        return ResponseEntity.ok(tableService.getTableById(tableId));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Table By ID With Orders (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Get table details by ID with orders eagerly loaded.
     * Available for waitress (USER role).
     */
    @GetMapping("/{tableId}/with-orders")
    @Operation(summary = "Get table by ID with orders", description = "Gets table details by ID with orders eagerly loaded. Available for waitress (USER role).")
    public ResponseEntity<TableDtoResponse> getTableByIdWithOrders(@PathVariable("tableId") Long tableId) {
        return ResponseEntity.ok(tableService.getTableByIdWithOrders(tableId));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Change Table Status (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Change table status. Available for waitress (USER role).
     */
    @PutMapping("/change-status")
    @Operation(summary = "Change table status", description = "Changes the status of a table. Available for waitress (USER role).")
    public ResponseEntity<TableDtoResponse> changeTableStatus(@Valid @RequestBody ChangeTableStatusDtoRequest request) {
        return ResponseEntity.ok(tableService.updateTableStatus(request.getTableId(), request.getStatus()));
    }
}

