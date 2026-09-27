package com.businessassistant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class SalesReportDTO {

    private BigDecimal totalSales;
    private long transactionCount;
    private BigDecimal averageSaleValue;
    private List<SalesByDate> salesByDate;
    private List<SalesByDate> salesByDayOfWeek;
    private List<SalesByDate> salesByMonth;
    private List<TopProductDTO> topProducts;
    private List<TopProductDTO> slowProducts;
    private Map<String, BigDecimal> paymentMethodDistribution;

    private String bestSellingDay;
    private BigDecimal bestSellingDayRevenue;
    private String bestSellingWeek;
    private BigDecimal bestSellingWeekRevenue;
    private String bestSellingMonth;
    private BigDecimal bestSellingMonthRevenue;
    private BigDecimal previousPeriodSales;
    private Double growthPercentage;

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

    public List<SalesByDate> getSalesByDayOfWeek() {
        return salesByDayOfWeek;
    }

    public void setSalesByDayOfWeek(List<SalesByDate> salesByDayOfWeek) {
        this.salesByDayOfWeek = salesByDayOfWeek;
    }

    public List<SalesByDate> getSalesByMonth() {
        return salesByMonth;
    }

    public void setSalesByMonth(List<SalesByDate> salesByMonth) {
        this.salesByMonth = salesByMonth;
    }

    public List<TopProductDTO> getTopProducts() {
        return topProducts;
    }

    public void setTopProducts(List<TopProductDTO> topProducts) {
        this.topProducts = topProducts;
    }

    public List<TopProductDTO> getSlowProducts() {
        return slowProducts;
    }

    public void setSlowProducts(List<TopProductDTO> slowProducts) {
        this.slowProducts = slowProducts;
    }

    public Map<String, BigDecimal> getPaymentMethodDistribution() {
        return paymentMethodDistribution;
    }

    public void setPaymentMethodDistribution(Map<String, BigDecimal> paymentMethodDistribution) {
        this.paymentMethodDistribution = paymentMethodDistribution;
    }

    public String getBestSellingDay() {
        return bestSellingDay;
    }

    public void setBestSellingDay(String bestSellingDay) {
        this.bestSellingDay = bestSellingDay;
    }

    public BigDecimal getBestSellingDayRevenue() {
        return bestSellingDayRevenue;
    }

    public void setBestSellingDayRevenue(BigDecimal bestSellingDayRevenue) {
        this.bestSellingDayRevenue = bestSellingDayRevenue;
    }

    public String getBestSellingWeek() {
        return bestSellingWeek;
    }

    public void setBestSellingWeek(String bestSellingWeek) {
        this.bestSellingWeek = bestSellingWeek;
    }

    public BigDecimal getBestSellingWeekRevenue() {
        return bestSellingWeekRevenue;
    }

    public void setBestSellingWeekRevenue(BigDecimal bestSellingWeekRevenue) {
        this.bestSellingWeekRevenue = bestSellingWeekRevenue;
    }

    public String getBestSellingMonth() {
        return bestSellingMonth;
    }

    public void setBestSellingMonth(String bestSellingMonth) {
        this.bestSellingMonth = bestSellingMonth;
    }

    public BigDecimal getBestSellingMonthRevenue() {
        return bestSellingMonthRevenue;
    }

    public void setBestSellingMonthRevenue(BigDecimal bestSellingMonthRevenue) {
        this.bestSellingMonthRevenue = bestSellingMonthRevenue;
    }

    public BigDecimal getPreviousPeriodSales() {
        return previousPeriodSales;
    }

    public void setPreviousPeriodSales(BigDecimal previousPeriodSales) {
        this.previousPeriodSales = previousPeriodSales;
    }

    public Double getGrowthPercentage() {
        return growthPercentage;
    }

    public void setGrowthPercentage(Double growthPercentage) {
        this.growthPercentage = growthPercentage;
    }
}
