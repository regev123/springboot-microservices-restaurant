package com.restaurant.tableorder.table_order_service.controller;

import com.restaurant.common.annotation.RequiresRole;
import com.restaurant.tableorder.table_order_service.dto.Order.CreateOrderDtoRequest;
import com.restaurant.tableorder.table_order_service.dto.Order.OrderDtoResponse;
import com.restaurant.tableorder.table_order_service.service.OrderService;
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
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "Endpoints for managing orders and order items. Available for waitress (USER role).")
@SecurityRequirement(name = "Bearer Authentication")
/**
 * REST controller exposing endpoints for managing orders.
 * Follows Single Responsibility Principle by handling only order-related HTTP operations.
 */
public class OrderController {

    private final OrderService orderService;

    // ---------------------------------------------------------------------
    // Endpoint: Create Order (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Create a new order with items and send it to kitchen immediately.
     * Orders are created with PENDING status (approved and sent to kitchen).
     * Available for waitress (USER role).
     */
    @PostMapping("/create")
    @Operation(summary = "Create order", description = "Creates a new order with items and sends it to kitchen immediately. Requires USER role.")
    public ResponseEntity<OrderDtoResponse> createOrder(@Valid @RequestBody CreateOrderDtoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(request));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Cancel Order (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Cancel an order. Available for waitress (USER role).
     */
    @PutMapping("/{orderId}/cancel")
    @Operation(summary = "Cancel order", description = "Cancels an order. Requires USER role.")
    public ResponseEntity<OrderDtoResponse> cancelOrder(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Orders by Table (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Get all orders for a specific table. Available for waitress (USER role).
     */
    @GetMapping("/table/{tableId}")
    @Operation(summary = "Get orders by table", description = "Gets all orders for a specific table. Requires USER role.")
    public ResponseEntity<List<OrderDtoResponse>> getOrdersByTable(@PathVariable("tableId") Long tableId) {
        return ResponseEntity.ok(orderService.getOrdersByTable(tableId));
    }

    // ---------------------------------------------------------------------
    // Endpoint: Get Order by ID (Waitress)
    // ---------------------------------------------------------------------
    /**
     * Get order details by ID. Available for waitress (USER role).
     */
    @GetMapping("/{orderId}")
    @Operation(summary = "Get order by ID", description = "Gets order details by ID. Requires USER role.")
    public ResponseEntity<OrderDtoResponse> getOrderById(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}

