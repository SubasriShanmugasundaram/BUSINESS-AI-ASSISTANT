package com.businessassistant.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class SaleRequestDTO {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private LocalDate saleDate;

    @NotNull(message = "Payment method is required")
    private String paymentMethod; // 'Cash', 'UPI', 'Card', 'Other'

    private String notes;

    @NotEmpty(message = "At least one product item must be included in sale")
    @Valid
    private List<SaleItemDTO> items;

    public SaleRequestDTO() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<SaleItemDTO> getItems() {
        return items;
    }

    public void setItems(List<SaleItemDTO> items) {
        this.items = items;
    }
}
