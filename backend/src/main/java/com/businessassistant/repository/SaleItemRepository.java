package com.businessassistant.repository;

import com.businessassistant.dto.TopProductDTO;
import com.businessassistant.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

    @Query("SELECT new com.businessassistant.dto.TopProductDTO(" +
           "p.id, p.name, p.category, SUM(si.quantity), SUM(si.totalAmount)) " +
           "FROM SaleItem si JOIN si.product p " +
           "GROUP BY p.id, p.name, p.category " +
           "ORDER BY SUM(si.quantity) DESC")
    List<TopProductDTO> findTopSellingProducts();
}
