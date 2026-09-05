package com.dailybasket.controller;

import com.dailybasket.dto.ApiResponse;
import com.dailybasket.dto.OrderCreateRequest;
import com.dailybasket.dto.OrderDTO;
import com.dailybasket.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(Authentication authentication,
                                                            @Valid @RequestBody OrderCreateRequest request) {
        OrderDTO order = orderService.createOrder(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully!", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getUserOrders(Authentication authentication) {
        List<OrderDTO> orders = orderService.getUserOrders(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{orderIdentifier}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderDetails(Authentication authentication,
                                                                 @PathVariable String orderIdentifier) {
        OrderDTO order = orderService.getOrderByIdOrNumber(authentication.getName(), orderIdentifier);
        return ResponseEntity.ok(ApiResponse.success(order));
    }
}
