package com.restaurant.tableorder.table_order_service.service;

import com.restaurant.common.exception.ResourceNotFoundException;
import com.restaurant.tableorder.table_order_service.dto.Table.CreateTableDtoRequest;
import com.restaurant.tableorder.table_order_service.dto.Table.TableDtoResponse;
import com.restaurant.tableorder.table_order_service.dto.Table.UpdateTableDtoRequest;
import com.restaurant.tableorder.table_order_service.entity.Table;
import com.restaurant.tableorder.table_order_service.entity.TableStatus;
import com.restaurant.tableorder.table_order_service.exceptions.TableAlreadyExistsException;
import com.restaurant.tableorder.table_order_service.mapper.TableMapper;
import com.restaurant.tableorder.table_order_service.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
/**
 * Application service encapsulating business logic for managing tables.
 * Follows Single Responsibility Principle by handling only table-related business logic.
 */
public class TableService {

    // ==================== CONSTANTS ====================
    private static final String TABLE_ALREADY_EXISTS_MSG = "Table already exists with number: %s";
    private static final String TABLE_NOT_FOUND_MSG = "Table not found with ID: %s";

    // ==================== DEPENDENCIES ====================
    private final TableRepository tableRepository;
    private final TableMapper tableMapper;

    // ---------------------------------------------------------------------
    // Command: Create Table
    // ---------------------------------------------------------------------
    /**
     * Create a new table.
     * Table number is always auto-generated:
     * - First tries to fill gaps (reuse deleted table numbers starting from 1)
     * - If no gaps exist, uses max table number + 1
     * This ensures reasonable table numbers and efficient gap filling.
     */
    public TableDtoResponse createTable(CreateTableDtoRequest request) {
        // Always auto-generate table number
        Integer tableNumber = getNextAvailableTableNumber();
        
        // Validate that the auto-generated number doesn't already exist (shouldn't happen, but safety check)
        if (tableRepository.existsByTableNumber(tableNumber)) {
            throw new TableAlreadyExistsException(
                    String.format(TABLE_ALREADY_EXISTS_MSG, tableNumber));
        }

        Table table = Table.builder()
                .tableNumber(tableNumber)
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .status(TableStatus.AVAILABLE)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Table saved = tableRepository.save(table);
        return tableMapper.toDto(saved);
    }
    
    /**
     * Get the next available table number using gap-filling strategy:
     * 1. Finds the lowest available gap starting from 1
     * 2. If no gaps exist, returns max table number + 1
     * 
     * This ensures deleted table numbers are reused before creating new high numbers.
     * 
     * @return the next available table number (minimum 1)
     */
    private Integer getNextAvailableTableNumber() {
        // Find the lowest gap (missing number starting from 1)
        Integer lowestGap = findLowestGap();
        if (lowestGap != null) {
            return lowestGap;
        }
        
        // No gaps found, use max + 1
        Integer maxTableNumber = tableRepository.findMaxTableNumber();
        return maxTableNumber == null || maxTableNumber == 0 ? 1 : maxTableNumber + 1;
    }
    
    /**
     * Finds the lowest gap in table numbers starting from 1.
     * For example, if tables 1, 2, 4, 5 exist, returns 3.
     * 
     * @return the lowest missing table number, or null if no gaps exist
     */
    private Integer findLowestGap() {
        List<Table> allTables = tableRepository.findAll();
        if (allTables.isEmpty()) {
            return 1; // First table gets number 1
        }
        
        // Get all existing table numbers sorted
        List<Integer> existingNumbers = allTables.stream()
                .map(Table::getTableNumber)
                .sorted()
                .toList();
        
        // Find the first gap starting from 1
        int expectedNumber = 1;
        for (Integer existingNumber : existingNumbers) {
            if (existingNumber > expectedNumber) {
                // Found a gap
                return expectedNumber;
            }
            expectedNumber = existingNumber + 1;
        }
        
        // No gaps found
        return null;
    }

    // ---------------------------------------------------------------------
    // Command: Update Table
    // ---------------------------------------------------------------------
    /**
     * Update an existing table.
     * Table number cannot be changed as it is auto-generated by the system.
     */
    public TableDtoResponse updateTable(UpdateTableDtoRequest request) {
        Table table = tableRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(TABLE_NOT_FOUND_MSG, request.getId())));

        // Table number is not updated - it remains as auto-generated value
        // Only update capacity, location, and active status
        table.setCapacity(request.getCapacity());
        table.setLocation(request.getLocation());
        if (request.getIsActive() != null) {
            table.setIsActive(request.getIsActive());
        }

        Table saved = tableRepository.save(table);
        return tableMapper.toDto(saved);
    }

    // ---------------------------------------------------------------------
    // Command: Delete Table
    // ---------------------------------------------------------------------
    /**
     * Delete a table by ID.
     */
    public void deleteTable(Long tableId) {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(TABLE_NOT_FOUND_MSG, tableId)));

        tableRepository.delete(table);
    }

    // ---------------------------------------------------------------------
    // Query: Get All Tables (Admin)
    // ---------------------------------------------------------------------
    /**
     * Get all tables.
     */
    @Transactional(readOnly = true)
    public List<TableDtoResponse> getAllTables() {
        return tableRepository.findAll().stream()
                .map(tableMapper::toDto)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // Query: Get All Active Tables (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Get all active tables.
     */
    @Transactional(readOnly = true)
    public List<TableDtoResponse> getAllActiveTables() {
        return tableRepository.findByIsActiveTrue().stream()
                .map(tableMapper::toDto)
                .collect(Collectors.toList());
    }

    // ---------------------------------------------------------------------
    // Query: Get Table By ID
    // ---------------------------------------------------------------------
    /**
     * Get a table by ID.
     * Orders are not loaded by default (lazy fetching).
     */
    @Transactional(readOnly = true)
    public TableDtoResponse getTableById(Long tableId) {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(TABLE_NOT_FOUND_MSG, tableId)));
        return tableMapper.toDto(table);
    }

    /**
     * Get a table by ID with orders eagerly loaded.
     * Use this method when orders are needed.
     */
    @Transactional(readOnly = true)
    public TableDtoResponse getTableByIdWithOrders(Long tableId) {
        Table table = tableRepository.findByIdWithOrders(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(TABLE_NOT_FOUND_MSG, tableId)));
        return tableMapper.toDto(table);
    }

    // ---------------------------------------------------------------------
    // Command: Update Table Status
    // ---------------------------------------------------------------------
    /**
     * Update table status.
     * Can be used internally or via REST API.
     */
    public TableDtoResponse updateTableStatus(Long tableId, TableStatus status) {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format(TABLE_NOT_FOUND_MSG, tableId)));
        table.setStatus(status);
        Table saved = tableRepository.save(table);
        return tableMapper.toDto(saved);
    }
}

