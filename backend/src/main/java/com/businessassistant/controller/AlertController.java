package com.businessassistant.controller;

import com.businessassistant.dto.BusinessAlertDTO;
import com.businessassistant.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<BusinessAlertDTO>> getAlerts() {
        return ResponseEntity.ok(alertService.getAlerts());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<BusinessAlertDTO> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.markAsRead(id));
    }
}
