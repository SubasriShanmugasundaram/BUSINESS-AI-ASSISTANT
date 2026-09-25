package com.businessassistant.service;

import com.businessassistant.dto.InventoryDTO;
import com.businessassistant.dto.InventorySummaryDTO;
import com.businessassistant.dto.StockOperationRequestDTO;
import com.businessassistant.entity.Inventory;
import com.businessassistant.entity.Product;
import com.businessassistant.entity.StockMovement;
import com.businessassistant.exception.BadRequestException;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.InventoryRepository;
import com.businessassistant.repository.ProductRepository;
import com.businessassistant.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            ProductRepository productRepository,
                            StockMovementRepository stockMovementRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<InventoryDTO> getAllInventory(String search, String status) {
        List<Inventory> items;

        if (search != null && !search.trim().isEmpty()) {
            items = inventoryRepository.searchInventory(search.trim());
        } else if ("LOW_STOCK".equalsIgnoreCase(status)) {
            items = inventoryRepository.findLowStockItems();
        } else if ("OUT_OF_STOCK".equalsIgnoreCase(status)) {
            items = inventoryRepository.findOutOfStockItems();
        } else {
            items = inventoryRepository.findAll();
        }

        return items.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public InventoryDTO getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> createDefaultInventoryForProduct(productId));
        return toDTO(inventory);
    }

    public Inventory getOrCreateInventory(Product product) {
        return inventoryRepository.findByProductId(product.getId())
                .orElseGet(() -> {
                    Inventory inv = new Inventory(product, 0, 10);
                    return inventoryRepository.save(inv);
                });
    }

    public InventoryDTO updateStock(StockOperationRequestDTO request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        Inventory inventory = getOrCreateInventory(product);
        String opType = request.getOperationType() != null ? request.getOperationType().toUpperCase() : "ADD";
        int qty = request.getQuantity() != null ? request.getQuantity() : 0;
        String reason = request.getReason() != null ? request.getReason() : "Manual Adjustment";
        String refId = request.getReferenceId();

        if (request.getReorderLevel() != null && request.getReorderLevel() >= 0) {
            inventory.setReorderLevel(request.getReorderLevel());
        }

        int previousStock = inventory.getCurrentStock();

        switch (opType) {
            case "ADD":
            case "PURCHASE":
            case "RESTOCK":
                if (qty <= 0) {
                    throw new BadRequestException("Quantity to add must be greater than 0");
                }
                inventory.setCurrentStock(previousStock + qty);
                inventory.setLastRestockedAt(LocalDateTime.now());
                stockMovementRepository.save(new StockMovement(
                        product,
                        "Purchase",
                        qty,
                        LocalDate.now(),
                        reason,
                        refId != null ? refId : "RESTOCK-" + System.currentTimeMillis() % 10000
                ));
                break;

            case "REMOVE":
            case "DAMAGE":
            case "RETURN":
            case "LOSS":
                if (qty <= 0) {
                    throw new BadRequestException("Quantity to remove must be greater than 0");
                }
                if (previousStock < qty) {
                    throw new BadRequestException("Cannot remove " + qty + " units. Current stock is only " + previousStock);
                }
                inventory.setCurrentStock(previousStock - qty);
                stockMovementRepository.save(new StockMovement(
                        product,
                        "Adjustment",
                        -qty,
                        LocalDate.now(),
                        reason,
                        refId
                ));
                break;

            case "ADJUST":
                int delta = qty - previousStock;
                inventory.setCurrentStock(Math.max(0, qty));
                if (delta > 0) {
                    inventory.setLastRestockedAt(LocalDateTime.now());
                }
                stockMovementRepository.save(new StockMovement(
                        product,
                        "Adjustment",
                        delta,
                        LocalDate.now(),
                        reason,
                        refId
                ));
                break;

            case "UPDATE_SETTINGS":
                // Handled above (reorderLevel)
                break;

            default:
                throw new BadRequestException("Unsupported operation type: " + opType);
        }

        Inventory saved = inventoryRepository.save(inventory);
        return toDTO(saved);
    }

    /**
     * Deducts stock automatically when a sale is finalized.
     * Called by SaleService.
     */
    public void deductStockForSale(String saleNumber, Product product, int quantity) {
        Inventory inventory = getOrCreateInventory(product);
        int current = inventory.getCurrentStock();
        if (current < quantity) {
            throw new BadRequestException("Insufficient inventory stock for '" + product.getName() + "'. Available: " + current + " units, Requested: " + quantity + " units.");
        }
        int updated = current - quantity;
        inventory.setCurrentStock(updated);
        inventoryRepository.save(inventory);

        // Record stock movement
        StockMovement movement = new StockMovement(
                product,
                "Sale",
                -quantity,
                LocalDate.now(),
                "Sale Order " + saleNumber,
                saleNumber
        );
        stockMovementRepository.save(movement);
    }

    public InventorySummaryDTO getInventorySummary() {
        long totalProducts = productRepository.count();
        Long totalStockUnits = inventoryRepository.sumTotalStockUnits();
        if (totalStockUnits == null) totalStockUnits = 0L;

        long inStock = inventoryRepository.countInStock();
        long lowStock = inventoryRepository.countLowStock();
        long outOfStock = inventoryRepository.countOutOfStock();

        BigDecimal totalValue = inventoryRepository.sumTotalInventoryValue();
        if (totalValue == null) totalValue = BigDecimal.ZERO;

        List<Inventory> allInventory = inventoryRepository.findAll();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Inventory inv : allInventory) {
            String cat = inv.getProduct().getCategory();
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0L) + inv.getCurrentStock());
        }

        return new InventorySummaryDTO(
                totalProducts,
                totalStockUnits,
                inStock,
                lowStock,
                outOfStock,
                totalValue,
                categoryMap
        );
    }

    private Inventory createDefaultInventoryForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        Inventory inv = new Inventory(product, 0, 10);
        return inventoryRepository.save(inv);
    }

    public InventoryDTO toDTO(Inventory inv) {
        Product product = inv.getProduct();
        BigDecimal price = (product.getPrice() != null) ? product.getPrice() : BigDecimal.ZERO;
        BigDecimal inventoryValue = price.multiply(BigDecimal.valueOf(inv.getCurrentStock() != null ? inv.getCurrentStock() : 0));

        return new InventoryDTO(
                inv.getId(),
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getCategory(),
                inv.getCurrentStock(),
                inv.getReorderLevel(),
                product.getPurchasePrice(),
                product.getSellingPrice(),
                inv.getStockStatus(),
                inventoryValue,
                inv.getLastRestockedAt(),
                inv.getUpdatedAt()
        );
    }
}
