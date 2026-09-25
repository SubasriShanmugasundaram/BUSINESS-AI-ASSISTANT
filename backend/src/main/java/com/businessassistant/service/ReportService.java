package com.businessassistant.service;

import com.businessassistant.dto.SalesReportDTO;
import com.businessassistant.dto.TopProductDTO;
import com.businessassistant.entity.Sale;
import com.businessassistant.repository.SaleItemRepository;
import com.businessassistant.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;

    public ReportService(SaleRepository saleRepository, SaleItemRepository saleItemRepository) {
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
    }

    public SalesReportDTO getSalesReportSummary(String timeframe) {
        LocalDate now = LocalDate.now();
        LocalDate startDate;

        if ("Today".equalsIgnoreCase(timeframe)) {
            startDate = now;
        } else if ("This Week".equalsIgnoreCase(timeframe)) {
            startDate = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        } else if ("This Month".equalsIgnoreCase(timeframe)) {
            startDate = now.withDayOfMonth(1);
        } else {
            // All time or default (last 30 days)
            startDate = now.minusDays(60);
        }

        List<Sale> sales = saleRepository.findBySaleDateBetweenOrderBySaleDateAsc(startDate, now);
        if (sales.isEmpty() && !"Today".equalsIgnoreCase(timeframe)) {
            sales = saleRepository.findAll();
        }

        BigDecimal totalRevenue = sales.stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long count = sales.size();
        BigDecimal avgValue = count > 0
                ? totalRevenue.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Group by Date
        Map<LocalDate, BigDecimal> dateMap = new TreeMap<>();
        Map<String, BigDecimal> paymentMap = new HashMap<>();

        for (Sale sale : sales) {
            LocalDate date = sale.getSaleDate();
            dateMap.put(date, dateMap.getOrDefault(date, BigDecimal.ZERO).add(sale.getTotalAmount()));

            String method = sale.getPaymentMethod() != null ? sale.getPaymentMethod() : "Other";
            paymentMap.put(method, paymentMap.getOrDefault(method, BigDecimal.ZERO).add(sale.getTotalAmount()));
        }

        List<SalesReportDTO.SalesByDate> salesByDate = dateMap.entrySet().stream()
                .map(entry -> new SalesReportDTO.SalesByDate(entry.getKey().toString(), entry.getValue()))
                .collect(Collectors.toList());

        List<TopProductDTO> topProducts = getTopProducts();

        SalesReportDTO report = new SalesReportDTO();
        report.setTotalSales(totalRevenue);
        report.setTransactionCount(count);
        report.setAverageSaleValue(avgValue);
        report.setSalesByDate(salesByDate);
        report.setTopProducts(topProducts);
        report.setPaymentMethodDistribution(paymentMap);

        return report;
    }

    public List<TopProductDTO> getTopProducts() {
        return saleItemRepository.findTopSellingProducts();
    }
}
