package com.businessassistant.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotBlank(message = "Movement type is required")
    @Column(name = "movement_type", nullable = false, length = 50)
    private String movementType; // 'Purchase', 'Sale', 'Adjustment', 'Return'

    @NotNull(message = "Quantity is required")
    @Column(nullable = false)
    private Integer quantity; // Signed or magnitude

    @NotNull(message = "Movement date is required")
    @Column(name = "movement_date", nullable = false)
    private LocalDate movementDate;

    @Column(length = 255)
    private String reason;

    @Column(name = "reference_id", length = 100)
    private String referenceId; // e.g. 'INV-2026-0001' or 'PO-1002'

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public StockMovement() {
    }

    public StockMovement(Product product, String movementType, Integer quantity, LocalDate movementDate, String reason, String referenceId) {
        this.product = product;
        this.movementType = movementType;
        this.quantity = quantity;
        this.movementDate = movementDate;
        this.reason = reason;
        this.referenceId = referenceId;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (movementDate == null) {
            movementDate = LocalDate.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getMovementType() {
        return movementType;
    }

    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
