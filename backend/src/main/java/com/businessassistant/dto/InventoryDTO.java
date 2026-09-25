package com.businessassistant.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InventoryDTO {

    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String category;
    private Integer currentStock;
    private Integer reorderLevel;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private String stockStatus;
    private BigDecimal inventoryValue;
    private LocalDateTime lastRestockedAt;
    private LocalDateTime updatedAt;

    public InventoryDTO() {
    }

    public InventoryDTO(Long id, Long productId, String productName, String productSku, String category,
                        Integer currentStock, Integer reorderLevel, BigDecimal purchasePrice,
                        BigDecimal sellingPrice, String stockStatus, BigDecimal inventoryValue,
                        LocalDateTime lastRestockedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.category = category;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.purchasePrice = purchasePrice;
        this.sellingPrice = sellingPrice;
        this.stockStatus = stockStatus;
        this.inventoryValue = inventoryValue;
        this.lastRestockedAt = lastRestockedAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSku() {
        return productSku;
    }

    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }

    public BigDecimal getInventoryValue() {
        return inventoryValue;
    }

    public void setInventoryValue(BigDecimal inventoryValue) {
        this.inventoryValue = inventoryValue;
    }

    public LocalDateTime getLastRestockedAt() {
        return lastRestockedAt;
    }

    public void setLastRestockedAt(LocalDateTime lastRestockedAt) {
        this.lastRestockedAt = lastRestockedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
