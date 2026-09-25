package com.businessassistant.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SalesForecastDTO {

    private Long productId;
    private String productName;
    private String category;
    private LocalDate forecastDate;
    private Integer predictedQuantity;
    private BigDecimal predictedRevenue;
    private Double confidence;
    private String modelName;
    private String explanation;
    private String dataCoverage; // "SUFFICIENT_HISTORY", "LIMITED_DATA_FALLBACK"

    public SalesForecastDTO() {
    }

    public SalesForecastDTO(Long productId, String productName, String category, LocalDate forecastDate,
                            Integer predictedQuantity, BigDecimal predictedRevenue, Double confidence,
                            String modelName, String explanation, String dataCoverage) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.forecastDate = forecastDate;
        this.predictedQuantity = predictedQuantity;
        this.predictedRevenue = predictedRevenue;
        this.confidence = confidence;
        this.modelName = modelName;
        this.explanation = explanation;
        this.dataCoverage = dataCoverage;
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

    public LocalDate getForecastDate() {
        return forecastDate;
    }

    public void setForecastDate(LocalDate forecastDate) {
        this.forecastDate = forecastDate;
    }

    public Integer getPredictedQuantity() {
        return predictedQuantity;
    }

    public void setPredictedQuantity(Integer predictedQuantity) {
        this.predictedQuantity = predictedQuantity;
    }

    public BigDecimal getPredictedRevenue() {
        return predictedRevenue;
    }

    public void setPredictedRevenue(BigDecimal predictedRevenue) {
        this.predictedRevenue = predictedRevenue;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getDataCoverage() {
        return dataCoverage;
    }

    public void setDataCoverage(String dataCoverage) {
        this.dataCoverage = dataCoverage;
    }
}
