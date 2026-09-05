package com.dailybasket.service;

import com.dailybasket.dto.ProductDTO;
import com.dailybasket.dto.ProductRequest;
import com.dailybasket.entity.Category;
import com.dailybasket.entity.Product;
import com.dailybasket.exception.BadRequestException;
import com.dailybasket.exception.ResourceNotFoundException;
import com.dailybasket.repository.CategoryRepository;
import com.dailybasket.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<ProductDTO> getProducts(
            Long categoryId,
            String query,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStock,
            Double minRating,
            String sortBy,
            String sortDir,
            int page,
            int size) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "desc"),
                sortBy != null ? sortBy : "id");

        if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "discountPrice");
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "discountPrice");
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.filterProducts(
                categoryId,
                (query != null && !query.isBlank()) ? query.trim() : null,
                minPrice,
                maxPrice,
                inStock,
                minRating,
                pageable
        );

        return productPage.map(this::mapToDTO);
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getDealsOfTheDay() {
        return productRepository.findByDealOfTheDayTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getLiveSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        Pageable pageable = PageRequest.of(0, 6);
        return productRepository.searchLiveSuggestions(query.trim(), pageable)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDTO(product);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToDTO(product);
    }

    @Transactional
    public ProductDTO createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String slug = generateSlug(request.getName());
        if (productRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(slug);
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setUnit(request.getUnit());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setInStock(request.getStockQuantity() > 0);
        product.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        product.setDealOfTheDay(request.getDealOfTheDay() != null ? request.getDealOfTheDay() : false);
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand() != null ? request.getBrand() : "DailyBasket Fresh");
        product.setIngredients(request.getIngredients());
        product.setOrigin(request.getOrigin());
        product.setRating(4.5);
        product.setReviewCount(8);

        Product saved = productRepository.save(product);
        return mapToDTO(saved);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setUnit(request.getUnit());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setInStock(request.getStockQuantity() > 0);
        if (request.getFeatured() != null) product.setFeatured(request.getFeatured());
        if (request.getDealOfTheDay() != null) product.setDealOfTheDay(request.getDealOfTheDay());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getBrand() != null) product.setBrand(request.getBrand());
        if (request.getIngredients() != null) product.setIngredients(request.getIngredients());
        if (request.getOrigin() != null) product.setOrigin(request.getOrigin());

        Product updated = productRepository.save(product);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public ProductDTO mapToDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSlug(p.getSlug());
        dto.setDescription(p.getDescription());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
            dto.setCategorySlug(p.getCategory().getSlug());
        }
        dto.setUnit(p.getUnit());
        dto.setOriginalPrice(p.getOriginalPrice());
        dto.setDiscountPrice(p.getDiscountPrice());
        dto.setDiscountPercentage(p.getDiscountPercentage());
        dto.setStockQuantity(p.getStockQuantity());
        dto.setInStock(p.isInStock());
        dto.setFeatured(p.isFeatured());
        dto.setDealOfTheDay(p.isDealOfTheDay());
        dto.setRating(p.getRating());
        dto.setReviewCount(p.getReviewCount());
        dto.setImageUrl(p.getImageUrl());
        dto.setBrand(p.getBrand());
        dto.setIngredients(p.getIngredients());
        dto.setOrigin(p.getOrigin());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }

    private String generateSlug(String input) {
        return input.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
    }
}
