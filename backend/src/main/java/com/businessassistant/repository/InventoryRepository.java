package com.businessassistant.repository;

import com.businessassistant.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE " +
           "LOWER(i.product.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.product.category) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY i.product.name ASC")
    List<Inventory> searchInventory(@Param("keyword") String keyword);

    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.reorderLevel ORDER BY i.currentStock ASC")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.currentStock = 0 ORDER BY i.product.name ASC")
    List<Inventory> findOutOfStockItems();

    @Query("SELECT COALESCE(SUM(i.currentStock), 0) FROM Inventory i")
    Long sumTotalStockUnits();

    @Query("SELECT COALESCE(SUM(i.currentStock * i.product.sellingPrice), 0) FROM Inventory i")
    BigDecimal sumTotalInventoryValue();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock <= i.reorderLevel AND i.currentStock > 0")
    long countLowStock();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock = 0")
    long countOutOfStock();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.currentStock > i.reorderLevel")
    long countInStock();
}
