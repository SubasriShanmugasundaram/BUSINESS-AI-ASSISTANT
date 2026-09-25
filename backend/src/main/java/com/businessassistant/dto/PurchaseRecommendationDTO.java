package com.businessassistant.dto;

import java.math.BigDecimal;

public class PurchaseRecommendationDTO {

    private Long productId;
    private String productName;
    private String category;
    private Integer currentStock;
    private Integer reorderLevel;
    private Integer predictedDemand;
    private Integer recommendedQuantity;
    private BigDecimal estimatedCost;
    private String priority; // "HIGH", "MEDIUM", "LOW"
    private String reason;

    public PurchaseRecommendationDTO() {
    }

    public PurchaseRecommendationDTO(Long productId, String productName, String category,
                                      Integer currentStock, Integer reorderLevel, Integer predictedDemand,
                                      Integer recommendedQuantity, BigDecimal estimatedCost,
                                      String priority, String reason) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.predictedDemand = predictedDemand;
        this.recommendedQuantity = recommendedQuantity;
        this.estimatedCost = estimatedCost;
        this.priority = priority;
        this.reason = reason;
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

    public Integer getPredictedDemand() {
        return predictedDemand;
    }

    public void setPredictedDemand(Integer predictedDemand) {
        this.predictedDemand = predictedDemand;
    }

    public Integer getRecommendedQuantity() {
        return recommendedQuantity;
    }

    public void setRecommendedQuantity(Integer recommendedQuantity) {
        this.recommendedQuantity = recommendedQuantity;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(BigDecimal estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
