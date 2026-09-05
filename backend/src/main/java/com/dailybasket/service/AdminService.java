package com.dailybasket.service;

import com.dailybasket.dto.DashboardStatsDTO;
import com.dailybasket.dto.OrderDTO;
import com.dailybasket.dto.UserDTO;
import com.dailybasket.entity.OrderStatus;
import com.dailybasket.repository.OrderRepository;
import com.dailybasket.repository.ProductRepository;
import com.dailybasket.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final UserService userService;

    public AdminService(UserRepository userRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository,
                        OrderService orderService,
                        UserService userService) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.userService = userService;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(productRepository.count());
        stats.setTotalOrders(orderRepository.count());

        BigDecimal revenue = orderRepository.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        long lowStock = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() <= 10)
                .count();
        stats.setLowStockProductsCount(lowStock);

        long pendingOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.PLACED || o.getOrderStatus() == OrderStatus.CONFIRMED)
                .count();
        stats.setPendingOrdersCount(pendingOrders);

        Pageable recentLimit = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<OrderDTO> recentOrders = orderRepository.findAll(recentLimit)
                .stream()
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());
        stats.setRecentOrders(recentOrders);

        return stats;
    }

    public Page<OrderDTO> getAllOrders(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            return orderRepository.findByOrderStatusOrderByCreatedAtDesc(orderStatus, pageable)
                    .map(orderService::mapToDTO);
        }
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(orderService::mapToDTO);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userService::mapToUserDTO)
                .collect(Collectors.toList());
    }
}
