package com.businessassistant.dto;

import java.math.BigDecimal;
import java.util.Map;

public class InventorySummaryDTO {

    private long totalProducts;
    private long totalStockUnits;
    private long inStockCount;
    private long lowStockCount;
    private long outOfStockCount;
    private BigDecimal totalInventoryValue;
    private Map<String, Long> categoryDistribution;

    public InventorySummaryDTO() {
    }

    public InventorySummaryDTO(long totalProducts, long totalStockUnits, long inStockCount,
                               long lowStockCount, long outOfStockCount, BigDecimal totalInventoryValue,
                               Map<String, Long> categoryDistribution) {
        this.totalProducts = totalProducts;
        this.totalStockUnits = totalStockUnits;
        this.inStockCount = inStockCount;
        this.lowStockCount = lowStockCount;
        this.outOfStockCount = outOfStockCount;
        this.totalInventoryValue = totalInventoryValue;
        this.categoryDistribution = categoryDistribution;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalStockUnits() {
        return totalStockUnits;
    }

    public void setTotalStockUnits(long totalStockUnits) {
        this.totalStockUnits = totalStockUnits;
    }

    public long getInStockCount() {
        return inStockCount;
    }

    public void setInStockCount(long inStockCount) {
        this.inStockCount = inStockCount;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getOutOfStockCount() {
        return outOfStockCount;
    }

    public void setOutOfStockCount(long outOfStockCount) {
        this.outOfStockCount = outOfStockCount;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public Map<String, Long> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<String, Long> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }
}
