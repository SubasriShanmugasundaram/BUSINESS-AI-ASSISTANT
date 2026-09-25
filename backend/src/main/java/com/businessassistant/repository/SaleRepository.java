package com.businessassistant.repository;

import com.businessassistant.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findAllByOrderBySaleDateDescCreatedAtDesc();

    List<Sale> findTop5ByOrderByCreatedAtDesc();

    List<Sale> findBySaleDateBetweenOrderBySaleDateAsc(LocalDate startDate, LocalDate endDate);

    List<Sale> findByCustomerId(Long customerId);

    @Query("SELECT COALESCE(SUM(s.totalAmount), 0) FROM Sale s WHERE s.saleDate = :date")
    BigDecimal sumTotalAmountBySaleDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(s.totalAmount), 0) FROM Sale s")
    BigDecimal sumTotalAmount();

    @Query("SELECT COUNT(s) FROM Sale s")
    long countTotalTransactions();
}
