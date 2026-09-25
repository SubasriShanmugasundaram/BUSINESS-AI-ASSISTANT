package com.businessassistant.service;

import com.businessassistant.dto.BusinessAlertDTO;
import com.businessassistant.entity.BusinessAlert;
import com.businessassistant.entity.Inventory;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.BusinessAlertRepository;
import com.businessassistant.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private final BusinessAlertRepository alertRepository;
    private final InventoryRepository inventoryRepository;

    public AlertService(BusinessAlertRepository alertRepository,
                        InventoryRepository inventoryRepository) {
        this.alertRepository = alertRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public List<BusinessAlertDTO> getAlerts() {
        syncRealtimeInventoryAlerts();

        return alertRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BusinessAlertDTO markAsRead(Long id) {
        BusinessAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id));
        alert.setIsRead(true);
        alert = alertRepository.save(alert);
        return toDTO(alert);
    }

    private void syncRealtimeInventoryAlerts() {
        // Find out of stock items
        List<Inventory> outOfStock = inventoryRepository.findOutOfStockItems();
        for (Inventory inv : outOfStock) {
            String title = "Critical: Out of Stock – " + inv.getProduct().getName();
            if (alertRepository.findAll().stream().noneMatch(a -> a.getTitle().equals(title) && !a.getIsRead())) {
                alertRepository.save(new BusinessAlert(
                        "OUT_OF_STOCK",
                        title,
                        "Current stock is 0 units. Immediate supplier replenishment required to avoid lost revenue.",
                        "CRITICAL",
                        inv.getProduct()
                ));
            }
        }

        // Find low stock items
        List<Inventory> lowStock = inventoryRepository.findLowStockItems();
        for (Inventory inv : lowStock) {
            if (inv.getCurrentStock() > 0) {
                String title = "Warning: Low Stock – " + inv.getProduct().getName();
                if (alertRepository.findAll().stream().noneMatch(a -> a.getTitle().equals(title) && !a.getIsRead())) {
                    alertRepository.save(new BusinessAlert(
                            "LOW_STOCK",
                            title,
                            "Stock is at " + inv.getCurrentStock() + " units (Reorder threshold: " + inv.getReorderLevel() + "). Consider placing an order soon.",
                            "WARNING",
                            inv.getProduct()
                    ));
                }
            }
        }
    }

    private BusinessAlertDTO toDTO(BusinessAlert a) {
        return new BusinessAlertDTO(
                a.getId(),
                a.getType(),
                a.getTitle(),
                a.getMessage(),
                a.getSeverity(),
                a.getProduct() != null ? a.getProduct().getId() : null,
                a.getProduct() != null ? a.getProduct().getName() : null,
                a.getIsRead(),
                a.getCreatedAt()
        );
    }
}
