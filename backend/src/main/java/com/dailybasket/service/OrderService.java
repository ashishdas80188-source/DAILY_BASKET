package com.dailybasket.service;

import com.dailybasket.dto.OrderCreateRequest;
import com.dailybasket.dto.OrderDTO;
import com.dailybasket.dto.OrderItemDTO;
import com.dailybasket.dto.OrderStatusUpdateRequest;
import com.dailybasket.entity.*;
import com.dailybasket.exception.BadRequestException;
import com.dailybasket.exception.ResourceNotFoundException;
import com.dailybasket.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        AddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public OrderDTO createOrder(String email, OrderCreateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Shopping cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Please add items before placing an order.");
        }

        // Determine shipping address
        String shippingName = request.getShippingFullName();
        String shippingPhone = request.getShippingPhone();
        String shippingStreet = request.getShippingStreetAddress();
        String shippingCity = request.getShippingCity();
        String shippingState = request.getShippingState();
        String shippingPin = request.getShippingPinCode();

        if (request.getAddressId() != null) {
            Address address = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new ResourceNotFoundException("Saved address not found"));
            shippingName = address.getFullName();
            shippingPhone = address.getPhone();
            shippingStreet = address.getStreetAddress() + (address.getLandmark() != null ? ", " + address.getLandmark() : "");
            shippingCity = address.getCity();
            shippingState = address.getState();
            shippingPin = address.getPinCode();
        }

        if (shippingName == null || shippingPhone == null || shippingStreet == null || shippingCity == null || shippingPin == null) {
            throw new BadRequestException("Complete shipping delivery details are required.");
        }

        // Calculate totals and verify inventory
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setShippingFullName(shippingName);
        order.setShippingPhone(shippingPhone);
        order.setShippingAddress(shippingStreet);
        order.setShippingCity(shippingCity);
        order.setShippingState(shippingState != null ? shippingState : "State");
        order.setShippingPinCode(shippingPin);
        order.setDeliverySlot(request.getDeliverySlot() != null ? request.getDeliverySlot() : "Standard Delivery (Tomorrow 7 AM - 10 AM)");
        order.setDeliveryNotes(request.getDeliveryNotes());
        order.setEstimatedDelivery(LocalDateTime.now().plusHours(18));

        // Parse Payment Method
        PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
        PaymentStatus paymentStatus = PaymentStatus.PENDING;

        if (request.getPaymentMethod() != null) {
            try {
                paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
                if (paymentMethod != PaymentMethod.CASH_ON_DELIVERY) {
                    paymentStatus = PaymentStatus.COMPLETED;
                }
            } catch (Exception e) {
                paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
            }
        }

        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(paymentStatus);
        order.setOrderStatus(OrderStatus.PLACED);

        for (CartItem item : cart.getItems()) {
            Product p = item.getProduct();
            if (p.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Item " + p.getName() + " does not have enough stock available.");
            }

            // Deduct stock
            p.setStockQuantity(p.getStockQuantity() - item.getQuantity());
            if (p.getStockQuantity() <= 0) {
                p.setInStock(false);
            }
            productRepository.save(p);

            BigDecimal lineTotal = p.getDiscountPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            if (p.getOriginalPrice() != null && p.getOriginalPrice().compareTo(p.getDiscountPrice()) > 0) {
                totalSavings = totalSavings.add(p.getOriginalPrice().subtract(p.getDiscountPrice()).multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            OrderItem orderItem = new OrderItem(
                    order,
                    p,
                    p.getName(),
                    p.getUnit(),
                    p.getDiscountPrice(),
                    item.getQuantity(),
                    lineTotal,
                    p.getImageUrl()
            );
            orderItems.add(orderItem);
        }

        BigDecimal freeThreshold = new BigDecimal("499.00");
        BigDecimal deliveryFee = subtotal.compareTo(freeThreshold) >= 0 ? BigDecimal.ZERO : new BigDecimal("40.00");
        BigDecimal finalTotal = subtotal.add(deliveryFee);

        order.setSubtotal(subtotal);
        order.setDiscountAmount(totalSavings);
        order.setDeliveryFee(deliveryFee);
        order.setTotalAmount(finalTotal);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear user's shopping cart
        cartItemRepository.deleteByCartId(cart.getId());

        return mapToDTO(savedOrder);
    }

    public List<OrderDTO> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderByIdOrNumber(String email, String orderIdentifier) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Order order;
        try {
            Long orderId = Long.parseLong(orderIdentifier);
            order = orderRepository.findById(orderId)
                    .orElseGet(() -> orderRepository.findByOrderNumber(orderIdentifier)
                            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderIdentifier)));
        } catch (NumberFormatException e) {
            order = orderRepository.findByOrderNumber(orderIdentifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderIdentifier));
        }

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Unauthorized access to this order");
        }

        return mapToDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (request.getOrderStatus() != null) {
            order.setOrderStatus(OrderStatus.valueOf(request.getOrderStatus().toUpperCase()));
            if (order.getOrderStatus() == OrderStatus.DELIVERED) {
                order.setPaymentStatus(PaymentStatus.COMPLETED);
            }
        }

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(PaymentStatus.valueOf(request.getPaymentStatus().toUpperCase()));
        }

        Order updated = orderRepository.save(order);
        return mapToDTO(updated);
    }

    public OrderDTO mapToDTO(Order o) {
        OrderDTO dto = new OrderDTO();
        dto.setId(o.getId());
        dto.setOrderNumber(o.getOrderNumber());
        if (o.getUser() != null) {
            dto.setUserId(o.getUser().getId());
            dto.setUserFullName(o.getUser().getFullName());
            dto.setUserEmail(o.getUser().getEmail());
        }
        dto.setSubtotal(o.getSubtotal());
        dto.setDiscountAmount(o.getDiscountAmount());
        dto.setDeliveryFee(o.getDeliveryFee());
        dto.setTotalAmount(o.getTotalAmount());
        dto.setPaymentMethod(o.getPaymentMethod().name());
        dto.setPaymentStatus(o.getPaymentStatus().name());
        dto.setOrderStatus(o.getOrderStatus().name());
        dto.setShippingFullName(o.getShippingFullName());
        dto.setShippingPhone(o.getShippingPhone());
        dto.setShippingAddress(o.getShippingAddress());
        dto.setShippingCity(o.getShippingCity());
        dto.setShippingState(o.getShippingState());
        dto.setShippingPinCode(o.getShippingPinCode());
        dto.setDeliverySlot(o.getDeliverySlot());
        dto.setDeliveryNotes(o.getDeliveryNotes());
        dto.setEstimatedDelivery(o.getEstimatedDelivery());
        dto.setCreatedAt(o.getCreatedAt());
        dto.setUpdatedAt(o.getUpdatedAt());

        List<OrderItemDTO> itemDTOs = new ArrayList<>();
        if (o.getItems() != null) {
            for (OrderItem i : o.getItems()) {
                OrderItemDTO itemDto = new OrderItemDTO();
                itemDto.setId(i.getId());
                itemDto.setProductId(i.getProduct() != null ? i.getProduct().getId() : null);
                itemDto.setProductName(i.getProductName());
                itemDto.setProductUnit(i.getProductUnit());
                itemDto.setUnitPrice(i.getUnitPrice());
                itemDto.setQuantity(i.getQuantity());
                itemDto.setSubtotal(i.getSubtotal());
                itemDto.setImageUrl(i.getImageUrl());
                itemDTOs.add(itemDto);
            }
        }
        dto.setItems(itemDTOs);

        return dto;
    }

    private String generateOrderNumber() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomDigits = 1000 + new Random().nextInt(9000);
        return "DB-" + datePrefix + "-" + randomDigits;
    }
}
