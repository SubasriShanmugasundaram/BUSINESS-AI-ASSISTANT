package com.businessassistant.controller;

import com.businessassistant.dto.SalesReportDTO;
import com.businessassistant.dto.TopProductDTO;
import com.businessassistant.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/sales-summary")
    public ResponseEntity<SalesReportDTO> getSalesSummary(
            @RequestParam(defaultValue = "This Month") String timeframe) {
        return ResponseEntity.ok(reportService.getSalesReportSummary(timeframe));
    }

    @GetMapping("/sales")
    public ResponseEntity<SalesReportDTO> getSalesReports(
            @RequestParam(defaultValue = "All Time") String timeframe) {
        return ResponseEntity.ok(reportService.getSalesReportSummary(timeframe));
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopProducts() {
        return ResponseEntity.ok(reportService.getTopProducts());
    }

    @GetMapping("/payment-distribution")
    public ResponseEntity<java.util.Map<String, java.math.BigDecimal>> getPaymentDistribution() {
        return ResponseEntity.ok(reportService.getSalesReportSummary("All Time").getPaymentMethodDistribution());
    }

    @GetMapping("/daily-revenue")
    public ResponseEntity<List<SalesReportDTO.SalesByDate>> getDailyRevenue() {
        return ResponseEntity.ok(reportService.getSalesReportSummary("All Time").getSalesByDate());
    }
}
