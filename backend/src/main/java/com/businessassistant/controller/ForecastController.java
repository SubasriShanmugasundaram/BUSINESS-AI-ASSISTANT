package com.businessassistant.controller;

import com.businessassistant.dto.InventoryForecastDTO;
import com.businessassistant.dto.PurchaseRecommendationDTO;
import com.businessassistant.dto.SalesForecastDTO;
import com.businessassistant.service.MlForecastingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ForecastController {

    private final MlForecastingService mlForecastingService;

    public ForecastController(MlForecastingService mlForecastingService) {
        this.mlForecastingService = mlForecastingService;
    }

    @GetMapping("/api/forecasts/sales")
    public ResponseEntity<List<SalesForecastDTO>> getSalesForecast() {
        return ResponseEntity.ok(mlForecastingService.getSalesForecast());
    }

    @GetMapping("/api/forecasts/inventory")
    public ResponseEntity<List<InventoryForecastDTO>> getInventoryForecast() {
        return ResponseEntity.ok(mlForecastingService.getInventoryForecast());
    }

    @GetMapping("/api/recommendations/purchases")
    public ResponseEntity<List<PurchaseRecommendationDTO>> getPurchaseRecommendations() {
        return ResponseEntity.ok(mlForecastingService.getPurchaseRecommendations());
    }
}
