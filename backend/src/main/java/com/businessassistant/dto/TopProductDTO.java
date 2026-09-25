package com.businessassistant.dto;

import java.math.BigDecimal;

public class TopProductDTO {

    private Long productId;
    private String productName;
    private String category;
    private Long quantitySold;
    private BigDecimal revenue;

    public TopProductDTO() {
    }

    public TopProductDTO(Long productId, String productName, String category, Long quantitySold, BigDecimal revenue) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
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

    public Long getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(Long quantitySold) {
        this.quantitySold = quantitySold;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
