package com.businessassistant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class ExpenseSummaryDTO {

    private BigDecimal todayExpenses;
    private BigDecimal thisWeekExpenses;
    private BigDecimal thisMonthExpenses;
    private BigDecimal totalExpenses;
    private String highestExpenseCategory;
    private BigDecimal highestCategoryAmount;
    private Map<String, BigDecimal> expensesByCategory;
    private List<ExpenseTrendPoint> monthlyTrend;

    public static class ExpenseTrendPoint {
        private String label; // e.g. "2026-09" or Date "09-15"
        private BigDecimal amount;

        public ExpenseTrendPoint() {
        }

        public ExpenseTrendPoint(String label, BigDecimal amount) {
            this.label = label;
            this.amount = amount;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }

    public ExpenseSummaryDTO() {
    }

    public BigDecimal getTodayExpenses() {
        return todayExpenses;
    }

    public void setTodayExpenses(BigDecimal todayExpenses) {
        this.todayExpenses = todayExpenses;
    }

    public BigDecimal getThisWeekExpenses() {
        return thisWeekExpenses;
    }

    public void setThisWeekExpenses(BigDecimal thisWeekExpenses) {
        this.thisWeekExpenses = thisWeekExpenses;
    }

    public BigDecimal getThisMonthExpenses() {
        return thisMonthExpenses;
    }

    public void setThisMonthExpenses(BigDecimal thisMonthExpenses) {
        this.thisMonthExpenses = thisMonthExpenses;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public String getHighestExpenseCategory() {
        return highestExpenseCategory;
    }

    public void setHighestExpenseCategory(String highestExpenseCategory) {
        this.highestExpenseCategory = highestExpenseCategory;
    }

    public BigDecimal getHighestCategoryAmount() {
        return highestCategoryAmount;
    }

    public void setHighestCategoryAmount(BigDecimal highestCategoryAmount) {
        this.highestCategoryAmount = highestCategoryAmount;
    }

    public Map<String, BigDecimal> getExpensesByCategory() {
        return expensesByCategory;
    }

    public void setExpensesByCategory(Map<String, BigDecimal> expensesByCategory) {
        this.expensesByCategory = expensesByCategory;
    }

    public List<ExpenseTrendPoint> getMonthlyTrend() {
        return monthlyTrend;
    }

    public void setMonthlyTrend(List<ExpenseTrendPoint> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }
}
