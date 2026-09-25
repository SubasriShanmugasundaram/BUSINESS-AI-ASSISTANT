package com.businessassistant.repository;

import com.businessassistant.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findAllByOrderByMovementDateDescCreatedAtDesc();

    List<StockMovement> findByProductIdOrderByMovementDateDescCreatedAtDesc(Long productId);

    List<StockMovement> findByMovementTypeIgnoreCaseOrderByMovementDateDescCreatedAtDesc(String movementType);

    List<StockMovement> findByMovementDateBetweenOrderByMovementDateDescCreatedAtDesc(LocalDate startDate, LocalDate endDate);

    @Query("SELECT sm FROM StockMovement sm WHERE " +
           "LOWER(sm.product.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(COALESCE(sm.reason, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(COALESCE(sm.referenceId, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY sm.movementDate DESC, sm.createdAt DESC")
    List<StockMovement> searchMovements(@Param("keyword") String keyword);
}
