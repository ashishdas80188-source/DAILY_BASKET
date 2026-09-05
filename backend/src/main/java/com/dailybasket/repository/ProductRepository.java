package com.dailybasket.repository;

import com.dailybasket.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByFeaturedTrue();

    List<Product> findByDealOfTheDayTrue();

    List<Product> findByCategoryId(Long categoryId);

    @Query(value = "SELECT p FROM Product p WHERE " +
           "(cast(:categoryId as Long) IS NULL OR p.category.id = :categoryId) AND " +
           "(cast(:query as String) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', cast(:query as String), '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', cast(:query as String), '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', cast(:query as String), '%'))) AND " +
           "(cast(:minPrice as BigDecimal) IS NULL OR p.discountPrice >= :minPrice) AND " +
           "(cast(:maxPrice as BigDecimal) IS NULL OR p.discountPrice <= :maxPrice) AND " +
           "(cast(:inStock as Boolean) IS NULL OR p.inStock = :inStock) AND " +
           "(cast(:minRating as Double) IS NULL OR p.rating >= :minRating)",
           countQuery = "SELECT COUNT(p) FROM Product p WHERE " +
           "(cast(:categoryId as Long) IS NULL OR p.category.id = :categoryId) AND " +
           "(cast(:query as String) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', cast(:query as String), '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', cast(:query as String), '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', cast(:query as String), '%'))) AND " +
           "(cast(:minPrice as BigDecimal) IS NULL OR p.discountPrice >= :minPrice) AND " +
           "(cast(:maxPrice as BigDecimal) IS NULL OR p.discountPrice <= :maxPrice) AND " +
           "(cast(:inStock as Boolean) IS NULL OR p.inStock = :inStock) AND " +
           "(cast(:minRating as Double) IS NULL OR p.rating >= :minRating)")
    Page<Product> filterProducts(
            @Param("categoryId") Long categoryId,
            @Param("query") String query,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("inStock") Boolean inStock,
            @Param("minRating") Double minRating,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchLiveSuggestions(@Param("query") String query, Pageable pageable);

    long count();
}
