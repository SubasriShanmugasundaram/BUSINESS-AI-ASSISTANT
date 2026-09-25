package com.businessassistant.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class StockMovementDTO {

    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String productCategory;
    private String movementType;
    private Integer quantity;
    private LocalDate movementDate;
    private String reason;
    private String referenceId;
    private LocalDateTime createdAt;

    public StockMovementDTO() {
    }

    public StockMovementDTO(Long id, Long productId, String productName, String productSku,
                            String productCategory, String movementType, Integer quantity,
                            LocalDate movementDate, String reason, String referenceId,
                            LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.productCategory = productCategory;
        this.movementType = movementType;
        this.quantity = quantity;
        this.movementDate = movementDate;
        this.reason = reason;
        this.referenceId = referenceId;
        this.createdAt = createdAt;
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

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public String getMovementType() {
        return movementType;
    }

    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
