package com.businessassistant.dto;

import java.time.LocalDate;

public class InventoryForecastDTO {

    private Long productId;
    private String productName;
    private Integer currentStock;
    private Double averageDailyDemand;
    private Integer predicted7DayDemand;
    private Double stockCoverageDays;
    private LocalDate estimatedStockoutDate;
    private String stockoutRiskLevel; // "HIGH", "MODERATE", "LOW", "OUT_OF_STOCK"
    private String explanation;

    public InventoryForecastDTO() {
    }

    public InventoryForecastDTO(Long productId, String productName, Integer currentStock,
                                Double averageDailyDemand, Integer predicted7DayDemand,
                                Double stockCoverageDays, LocalDate estimatedStockoutDate,
                                String stockoutRiskLevel, String explanation) {
        this.productId = productId;
        this.productName = productName;
        this.currentStock = currentStock;
        this.averageDailyDemand = averageDailyDemand;
        this.predicted7DayDemand = predicted7DayDemand;
        this.stockCoverageDays = stockCoverageDays;
        this.estimatedStockoutDate = estimatedStockoutDate;
        this.stockoutRiskLevel = stockoutRiskLevel;
        this.explanation = explanation;
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

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Double getAverageDailyDemand() {
        return averageDailyDemand;
    }

    public void setAverageDailyDemand(Double averageDailyDemand) {
        this.averageDailyDemand = averageDailyDemand;
    }

    public Integer getPredicted7DayDemand() {
        return predicted7DayDemand;
    }

    public void setPredicted7DayDemand(Integer predicted7DayDemand) {
        this.predicted7DayDemand = predicted7DayDemand;
    }

    public Double getStockCoverageDays() {
        return stockCoverageDays;
    }

    public void setStockCoverageDays(Double stockCoverageDays) {
        this.stockCoverageDays = stockCoverageDays;
    }

    public LocalDate getEstimatedStockoutDate() {
        return estimatedStockoutDate;
    }

    public void setEstimatedStockoutDate(LocalDate estimatedStockoutDate) {
        this.estimatedStockoutDate = estimatedStockoutDate;
    }

    public String getStockoutRiskLevel() {
        return stockoutRiskLevel;
    }

    public void setStockoutRiskLevel(String stockoutRiskLevel) {
        this.stockoutRiskLevel = stockoutRiskLevel;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
