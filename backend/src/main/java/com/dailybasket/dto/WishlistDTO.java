package com.dailybasket.dto;

import java.time.LocalDateTime;

public class WishlistDTO {
    private Long id;
    private ProductDTO product;
    private LocalDateTime createdAt;

    public WishlistDTO() {}

    public WishlistDTO(Long id, ProductDTO product, LocalDateTime createdAt) {
        this.id = id;
        this.product = product;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
