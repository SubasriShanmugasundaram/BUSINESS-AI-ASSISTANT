package com.businessassistant.dto;

import java.time.LocalDateTime;

public class BusinessProfileDTO {

    private Long id;
    private String businessName;
    private String tagline;
    private String phone;
    private String email;
    private String gstin;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BusinessProfileDTO() {
    }

    public BusinessProfileDTO(Long id, String businessName, String tagline, String phone, String email, String gstin, String address, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.businessName = businessName;
        this.tagline = tagline;
        this.phone = phone;
        this.email = email;
        this.gstin = gstin;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
