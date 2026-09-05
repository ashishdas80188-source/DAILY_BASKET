package com.dailybasket.controller;

import com.dailybasket.dto.AddToCartRequest;
import com.dailybasket.dto.ApiResponse;
import com.dailybasket.dto.CartDTO;
import com.dailybasket.dto.UpdateCartItemRequest;
import com.dailybasket.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(Authentication authentication) {
        CartDTO cart = cartService.getCartByUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(Authentication authentication,
                                                         @Valid @RequestBody AddToCartRequest request) {
        CartDTO cart = cartService.addToCart(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItem(Authentication authentication,
                                                              @PathVariable Long itemId,
                                                              @Valid @RequestBody UpdateCartItemRequest request) {
        CartDTO cart = cartService.updateCartItem(authentication.getName(), itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDTO>> removeCartItem(Authentication authentication,
                                                              @PathVariable Long itemId) {
        CartDTO cart = cartService.removeCartItem(authentication.getName(), itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<CartDTO>> clearCart(Authentication authentication) {
        CartDTO cart = cartService.clearCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cart));
    }
}
