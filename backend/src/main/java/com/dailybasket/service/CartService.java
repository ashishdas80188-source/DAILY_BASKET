package com.dailybasket.service;

import com.dailybasket.dto.AddToCartRequest;
import com.dailybasket.dto.CartDTO;
import com.dailybasket.dto.CartItemDTO;
import com.dailybasket.dto.UpdateCartItemRequest;
import com.dailybasket.entity.Cart;
import com.dailybasket.entity.CartItem;
import com.dailybasket.entity.Product;
import com.dailybasket.entity.User;
import com.dailybasket.exception.BadRequestException;
import com.dailybasket.exception.ResourceNotFoundException;
import com.dailybasket.repository.CartItemRepository;
import com.dailybasket.repository.CartRepository;
import com.dailybasket.repository.ProductRepository;
import com.dailybasket.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartDTO getCartByUser(String email) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(String email, AddToCartRequest request) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!product.isInStock() || product.getStockQuantity() <= 0) {
            throw new BadRequestException("Product is out of stock");
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (newQty > product.getStockQuantity()) {
                newQty = product.getStockQuantity();
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            int qty = Math.min(request.getQuantity(), product.getStockQuantity());
            CartItem newItem = new CartItem(cart, product, qty);
            cartItemRepository.save(newItem);
        }

        return getCartByUser(email);
    }

    @Transactional
    public CartDTO updateCartItem(String email, Long itemId, UpdateCartItemRequest request) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to this cart item");
        }

        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(item);
        } else {
            Product product = item.getProduct();
            int finalQty = Math.min(request.getQuantity(), product.getStockQuantity());
            item.setQuantity(finalQty);
            cartItemRepository.save(item);
        }

        return getCartByUser(email);
    }

    @Transactional
    public CartDTO removeCartItem(String email, Long itemId) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Unauthorized access to this cart item");
        }

        cartItemRepository.delete(item);
        return getCartByUser(email);
    }

    @Transactional
    public CartDTO clearCart(String email) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        cartItemRepository.deleteByCartId(cart.getId());
        return getCartByUser(email);
    }

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());

        List<CartItemDTO> itemDTOs = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;
        int totalItemsCount = 0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                Product p = item.getProduct();
                CartItemDTO itemDto = new CartItemDTO();
                itemDto.setId(item.getId());
                itemDto.setProductId(p.getId());
                itemDto.setProductName(p.getName());
                itemDto.setProductSlug(p.getSlug());
                itemDto.setProductUnit(p.getUnit());
                itemDto.setImageUrl(p.getImageUrl());
                itemDto.setOriginalPrice(p.getOriginalPrice());
                itemDto.setDiscountPrice(p.getDiscountPrice());
                itemDto.setDiscountPercentage(p.getDiscountPercentage());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setStockQuantity(p.getStockQuantity());
                itemDto.setInStock(p.isInStock());

                BigDecimal lineTotal = p.getDiscountPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemDto.setItemTotal(lineTotal);

                subtotal = subtotal.add(lineTotal);
                if (p.getOriginalPrice() != null && p.getOriginalPrice().compareTo(p.getDiscountPrice()) > 0) {
                    BigDecimal lineSavings = p.getOriginalPrice().subtract(p.getDiscountPrice()).multiply(BigDecimal.valueOf(item.getQuantity()));
                    totalSavings = totalSavings.add(lineSavings);
                }

                totalItemsCount += item.getQuantity();
                itemDTOs.add(itemDto);
            }
        }

        dto.setItems(itemDTOs);
        dto.setTotalItems(totalItemsCount);
        dto.setSubtotal(subtotal);
        dto.setTotalSavings(totalSavings);

        BigDecimal freeThreshold = new BigDecimal("499.00");
        dto.setFreeDeliveryThreshold(freeThreshold);

        if (subtotal.compareTo(BigDecimal.ZERO) == 0) {
            dto.setDeliveryFee(BigDecimal.ZERO);
            dto.setFinalTotal(BigDecimal.ZERO);
            dto.setEligibleForFreeDelivery(false);
        } else if (subtotal.compareTo(freeThreshold) >= 0) {
            dto.setDeliveryFee(BigDecimal.ZERO);
            dto.setFinalTotal(subtotal);
            dto.setEligibleForFreeDelivery(true);
        } else {
            BigDecimal deliveryFee = new BigDecimal("40.00");
            dto.setDeliveryFee(deliveryFee);
            dto.setFinalTotal(subtotal.add(deliveryFee));
            dto.setEligibleForFreeDelivery(false);
        }

        return dto;
    }
}
