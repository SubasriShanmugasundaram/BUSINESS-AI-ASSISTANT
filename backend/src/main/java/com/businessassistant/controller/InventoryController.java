package com.businessassistant.controller;

import com.businessassistant.dto.InventoryDTO;
import com.businessassistant.dto.InventorySummaryDTO;
import com.businessassistant.dto.StockOperationRequestDTO;
import com.businessassistant.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getAllInventory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(inventoryService.getAllInventory(search, status));
    }

    @GetMapping("/summary")
    public ResponseEntity<InventorySummaryDTO> getInventorySummary() {
        return ResponseEntity.ok(inventoryService.getInventorySummary());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryDTO>> getLowStockInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory(null, "LOW_STOCK"));
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<InventoryDTO>> getOutOfStockInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory(null, "OUT_OF_STOCK"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<InventoryDTO>> searchInventory(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String keyword) {
        String searchTerm = (query != null && !query.trim().isEmpty()) ? query : keyword;
        return ResponseEntity.ok(inventoryService.getAllInventory(searchTerm, null));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryDTO> getInventoryByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<InventoryDTO> updateInventoryByProductId(
            @PathVariable Long productId,
            @RequestParam(required = false) Integer currentStock,
            @RequestParam(required = false) Integer reorderLevel,
            @RequestBody(required = false) StockOperationRequestDTO request) {
        if (request != null && request.getOperationType() != null) {
            request.setProductId(productId);
            return ResponseEntity.ok(inventoryService.updateStock(request));
        }
        Integer effStock = (request != null && request.getQuantity() != null) ? request.getQuantity() : currentStock;
        Integer effReorder = (request != null && request.getReorderLevel() != null) ? request.getReorderLevel() : reorderLevel;
        return ResponseEntity.ok(inventoryService.updateInventoryDirect(productId, effStock, effReorder));
    }

    @PostMapping("/adjust")
    public ResponseEntity<InventoryDTO> adjustStock(@Valid @RequestBody StockOperationRequestDTO request) {
        InventoryDTO updated = inventoryService.updateStock(request);
        return ResponseEntity.ok(updated);
    }
}
