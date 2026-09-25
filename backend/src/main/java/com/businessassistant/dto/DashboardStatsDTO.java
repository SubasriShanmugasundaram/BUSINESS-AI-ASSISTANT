package com.businessassistant.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDTO {

    private long totalCustomers;
    private long totalProducts;
    private BigDecimal todaySales;
    private BigDecimal totalSales;
    private long totalTransactions;
    private List<SaleResponseDTO> recentSales;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalCustomers, long totalProducts, BigDecimal todaySales, BigDecimal totalSales, long totalTransactions, List<SaleResponseDTO> recentSales) {
        this.totalCustomers = totalCustomers;
        this.totalProducts = totalProducts;
        this.todaySales = todaySales;
        this.totalSales = totalSales;
        this.totalTransactions = totalTransactions;
        this.recentSales = recentSales;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public BigDecimal getTodaySales() {
        return todaySales;
    }

    public void setTodaySales(BigDecimal todaySales) {
        this.todaySales = todaySales;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public List<SaleResponseDTO> getRecentSales() {
        return recentSales;
    }

    public void setRecentSales(List<SaleResponseDTO> recentSales) {
        this.recentSales = recentSales;
    }
}
