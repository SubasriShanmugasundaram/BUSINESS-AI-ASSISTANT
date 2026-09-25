package com.businessassistant.dto;

import java.math.BigDecimal;
import java.util.List;

public class GstSummaryDTO {

    private String gstin;
    private BigDecimal totalTaxableSales;
    private BigDecimal totalGstCollected;
    private BigDecimal totalCgst;
    private BigDecimal totalSgst;
    private BigDecimal totalIgst;
    private Integer totalInvoices;
    private List<GstReminderDTO> upcomingReminders;

    public GstSummaryDTO() {
    }

    public GstSummaryDTO(String gstin, BigDecimal totalTaxableSales, BigDecimal totalGstCollected,
                         BigDecimal totalCgst, BigDecimal totalSgst, BigDecimal totalIgst,
                         Integer totalInvoices, List<GstReminderDTO> upcomingReminders) {
        this.gstin = gstin;
        this.totalTaxableSales = totalTaxableSales;
        this.totalGstCollected = totalGstCollected;
        this.totalCgst = totalCgst;
        this.totalSgst = totalSgst;
        this.totalIgst = totalIgst;
        this.totalInvoices = totalInvoices;
        this.upcomingReminders = upcomingReminders;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public BigDecimal getTotalTaxableSales() {
        return totalTaxableSales;
    }

    public void setTotalTaxableSales(BigDecimal totalTaxableSales) {
        this.totalTaxableSales = totalTaxableSales;
    }

    public BigDecimal getTotalGstCollected() {
        return totalGstCollected;
    }

    public void setTotalGstCollected(BigDecimal totalGstCollected) {
        this.totalGstCollected = totalGstCollected;
    }

    public BigDecimal getTotalCgst() {
        return totalCgst;
    }

    public void setTotalCgst(BigDecimal totalCgst) {
        this.totalCgst = totalCgst;
    }

    public BigDecimal getTotalSgst() {
        return totalSgst;
    }

    public void setTotalSgst(BigDecimal totalSgst) {
        this.totalSgst = totalSgst;
    }

    public BigDecimal getTotalIgst() {
        return totalIgst;
    }

    public void setTotalIgst(BigDecimal totalIgst) {
        this.totalIgst = totalIgst;
    }

    public Integer getTotalInvoices() {
        return totalInvoices;
    }

    public void setTotalInvoices(Integer totalInvoices) {
        this.totalInvoices = totalInvoices;
    }

    public List<GstReminderDTO> getUpcomingReminders() {
        return upcomingReminders;
    }

    public void setUpcomingReminders(List<GstReminderDTO> upcomingReminders) {
        this.upcomingReminders = upcomingReminders;
    }
}
