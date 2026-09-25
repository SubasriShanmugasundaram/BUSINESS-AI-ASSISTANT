package com.businessassistant.dto;

import jakarta.validation.constraints.NotNull;

public class StockOperationRequestDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    // "ADD", "REMOVE", "ADJUST", or "UPDATE_SETTINGS"
    private String operationType;

    private Integer quantity;

    private Integer reorderLevel;

    private String reason;

    private String referenceId;

    public StockOperationRequestDTO() {
    }

    public StockOperationRequestDTO(Long productId, String operationType, Integer quantity, Integer reorderLevel, String reason, String referenceId) {
        this.productId = productId;
        this.operationType = operationType;
        this.quantity = quantity;
        this.reorderLevel = reorderLevel;
        this.reason = reason;
        this.referenceId = referenceId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
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
}
