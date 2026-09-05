package com.dailybasket.service;

import com.dailybasket.dto.ProductDTO;
import com.dailybasket.dto.WishlistDTO;
import com.dailybasket.entity.Product;
import com.dailybasket.entity.User;
import com.dailybasket.entity.Wishlist;
import com.dailybasket.exception.BadRequestException;
import com.dailybasket.exception.ResourceNotFoundException;
import com.dailybasket.repository.ProductRepository;
import com.dailybasket.repository.UserRepository;
import com.dailybasket.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public WishlistService(WishlistRepository wishlistRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           ProductService productService) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    public List<WishlistDTO> getUserWishlist(String email) {
        User user = getUser(email);
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(w -> new WishlistDTO(w.getId(), productService.mapToDTO(w.getProduct()), w.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistDTO addToWishlist(String email, Long productId) {
        User user = getUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new BadRequestException("Product is already in wishlist");
        }

        Wishlist wishlist = new Wishlist(user, product);
        Wishlist saved = wishlistRepository.save(wishlist);

        return new WishlistDTO(saved.getId(), productService.mapToDTO(saved.getProduct()), saved.getCreatedAt());
    }

    @Transactional
    public void removeFromWishlist(String email, Long productId) {
        User user = getUser(email);
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    public boolean isProductInWishlist(String email, Long productId) {
        User user = getUser(email);
        return wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
