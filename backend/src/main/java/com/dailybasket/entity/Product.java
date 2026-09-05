package com.dailybasket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String unit; // e.g., "1 L", "500 g", "1 kg", "6 pcs"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountPrice;

    private Integer discountPercentage = 0;

    @Column(nullable = false)
    private Integer stockQuantity = 50;

    private boolean inStock = true;

    private boolean featured = false;

    private boolean dealOfTheDay = false;

    private Double rating = 4.5;

    private Integer reviewCount = 0;

    @Column(nullable = false)
    private String imageUrl;

    private String brand = "DailyBasket Fresh";

    private String ingredients;

    private String origin;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Product() {}

    public Product(String name, String slug, String description, Category category, String unit,
                   BigDecimal originalPrice, BigDecimal discountPrice, Integer stockQuantity,
                   String imageUrl, String brand, boolean featured, boolean dealOfTheDay) {
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.category = category;
        this.unit = unit;
        this.originalPrice = originalPrice;
        this.discountPrice = discountPrice;
        this.stockQuantity = stockQuantity;
        this.inStock = stockQuantity > 0;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.featured = featured;
        this.dealOfTheDay = dealOfTheDay;
        this.rating = 4.5;
        this.reviewCount = 12;

        if (originalPrice != null && discountPrice != null && originalPrice.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = originalPrice.subtract(discountPrice);
            this.discountPercentage = diff.multiply(BigDecimal.valueOf(100))
                    .divide(originalPrice, 0, java.math.RoundingMode.HALF_UP).intValue();
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        calculateDiscount();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateDiscount();
        this.inStock = this.stockQuantity > 0;
    }

    public void calculateDiscount() {
        if (originalPrice != null && discountPrice != null && originalPrice.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = originalPrice.subtract(discountPrice);
            this.discountPercentage = diff.multiply(BigDecimal.valueOf(100))
                    .divide(originalPrice, 0, java.math.RoundingMode.HALF_UP).intValue();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(BigDecimal discountPrice) { this.discountPrice = discountPrice; }

    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { 
        this.stockQuantity = stockQuantity;
        this.inStock = stockQuantity != null && stockQuantity > 0;
    }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isDealOfTheDay() { return dealOfTheDay; }
    public void setDealOfTheDay(boolean dealOfTheDay) { this.dealOfTheDay = dealOfTheDay; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
