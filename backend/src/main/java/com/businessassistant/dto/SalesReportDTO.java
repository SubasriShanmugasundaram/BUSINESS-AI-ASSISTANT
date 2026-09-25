package com.businessassistant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class SalesReportDTO {

    private BigDecimal totalSales;
    private long transactionCount;
    private BigDecimal averageSaleValue;
    private List<SalesByDate> salesByDate;
    private List<TopProductDTO> topProducts;
    private Map<String, BigDecimal> paymentMethodDistribution;

    public static class SalesByDate {
        private String date;
        private BigDecimal amount;

        public SalesByDate() {
        }

        public SalesByDate(String date, BigDecimal amount) {
            this.date = date;
            this.amount = amount;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }

    public SalesReportDTO() {
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public BigDecimal getAverageSaleValue() {
        return averageSaleValue;
    }

    public void setAverageSaleValue(BigDecimal averageSaleValue) {
        this.averageSaleValue = averageSaleValue;
    }

    public List<SalesByDate> getSalesByDate() {
        return salesByDate;
    }

    public void setSalesByDate(List<SalesByDate> salesByDate) {
        this.salesByDate = salesByDate;
    }

    public List<TopProductDTO> getTopProducts() {
        return topProducts;
    }

    public void setTopProducts(List<TopProductDTO> topProducts) {
        this.topProducts = topProducts;
    }

    public Map<String, BigDecimal> getPaymentMethodDistribution() {
        return paymentMethodDistribution;
    }

    public void setPaymentMethodDistribution(Map<String, BigDecimal> paymentMethodDistribution) {
        this.paymentMethodDistribution = paymentMethodDistribution;
    }
}
