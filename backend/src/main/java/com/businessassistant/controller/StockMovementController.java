package com.businessassistant.controller;

import com.businessassistant.dto.StockMovementDTO;
import com.businessassistant.service.StockMovementService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
@CrossOrigin(origins = "*")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @GetMapping
    public ResponseEntity<List<StockMovementDTO>> getAllMovements(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) String movementType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(stockMovementService.getAllMovements(productId, movementType, startDate, endDate, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockMovementDTO> getMovementById(@PathVariable Long id) {
        return ResponseEntity.ok(stockMovementService.getMovementById(id));
    }
}
