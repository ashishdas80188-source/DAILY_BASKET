package com.dailybasket.controller;

import com.dailybasket.dto.ApiResponse;
import com.dailybasket.dto.WishlistDTO;
import com.dailybasket.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistDTO>>> getWishlist(Authentication authentication) {
        List<WishlistDTO> wishlist = wishlistService.getUserWishlist(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(wishlist));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<WishlistDTO>> addToWishlist(Authentication authentication, @PathVariable Long productId) {
        WishlistDTO item = wishlistService.addToWishlist(authentication.getName(), productId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Added to wishlist", item));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(Authentication authentication, @PathVariable Long productId) {
        wishlistService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", null));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkWishlistStatus(Authentication authentication, @PathVariable Long productId) {
        boolean inWishlist = wishlistService.isProductInWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("inWishlist", inWishlist)));
    }
}
