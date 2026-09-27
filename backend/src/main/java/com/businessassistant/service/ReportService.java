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
        LocalDate prevStartDate;
        LocalDate prevEndDate;

        if ("Today".equalsIgnoreCase(timeframe)) {
            startDate = now;
            prevStartDate = now.minusDays(1);
            prevEndDate = now.minusDays(1);
        } else if ("This Week".equalsIgnoreCase(timeframe)) {
            startDate = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            prevStartDate = startDate.minusWeeks(1);
            prevEndDate = startDate.minusDays(1);
        } else if ("This Month".equalsIgnoreCase(timeframe)) {
            startDate = now.withDayOfMonth(1);
            prevStartDate = startDate.minusMonths(1);
            prevEndDate = startDate.minusDays(1);
        } else {
            // All time or default (last 60 days)
            startDate = now.minusDays(60);
            prevStartDate = startDate.minusDays(60);
            prevEndDate = startDate.minusDays(1);
        }

        List<Sale> sales = saleRepository.findBySaleDateBetweenOrderBySaleDateAsc(startDate, now);
        if (sales.isEmpty() && !"Today".equalsIgnoreCase(timeframe)) {
            sales = saleRepository.findAll();
        }

        // Fetch previous period sales for period comparison (Feature 13)
        List<Sale> prevSales = saleRepository.findBySaleDateBetweenOrderBySaleDateAsc(prevStartDate, prevEndDate);
        BigDecimal prevTotalRevenue = prevSales.stream()
                .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = sales.stream()
                .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long count = sales.stream().filter(s -> "Completed".equalsIgnoreCase(s.getStatus())).count();
        BigDecimal avgValue = count > 0
                ? totalRevenue.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Group by Date, Day of Week, and Month (Features 10, 11, 12)
        Map<LocalDate, BigDecimal> dateMap = new TreeMap<>();
        Map<DayOfWeek, BigDecimal> dayOfWeekMap = new EnumMap<>(DayOfWeek.class);
        Map<String, BigDecimal> monthMap = new LinkedHashMap<>();
        Map<String, BigDecimal> weekMap = new LinkedHashMap<>();
        Map<String, BigDecimal> paymentMap = new HashMap<>();

        // Initialize DayOfWeek map for all 7 days
        for (DayOfWeek dow : DayOfWeek.values()) {
            dayOfWeekMap.put(dow, BigDecimal.ZERO);
        }

        // Get all time sales for comprehensive best week/month analysis
        List<Sale> allTimeSales = saleRepository.findAll();

        for (Sale sale : allTimeSales) {
            if (!"Completed".equalsIgnoreCase(sale.getStatus())) continue;

            LocalDate date = sale.getSaleDate();
            DayOfWeek dow = date.getDayOfWeek();
            dayOfWeekMap.put(dow, dayOfWeekMap.getOrDefault(dow, BigDecimal.ZERO).add(sale.getTotalAmount()));

            String monthKey = date.getYear() + "-" + String.format("%02d", date.getMonthValue());
            monthMap.put(monthKey, monthMap.getOrDefault(monthKey, BigDecimal.ZERO).add(sale.getTotalAmount()));

            // Week key format: YYYY-WweekNumber
            int weekNum = date.get(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR);
            String weekKey = date.getYear() + "-W" + String.format("%02d", weekNum);
            weekMap.put(weekKey, weekMap.getOrDefault(weekKey, BigDecimal.ZERO).add(sale.getTotalAmount()));

            if (!date.isBefore(startDate) && !date.isAfter(now)) {
                dateMap.put(date, dateMap.getOrDefault(date, BigDecimal.ZERO).add(sale.getTotalAmount()));
                String method = sale.getPaymentMethod() != null ? sale.getPaymentMethod() : "Other";
                paymentMap.put(method, paymentMap.getOrDefault(method, BigDecimal.ZERO).add(sale.getTotalAmount()));
            }
        }

        List<SalesReportDTO.SalesByDate> salesByDate = dateMap.entrySet().stream()
                .map(entry -> new SalesReportDTO.SalesByDate(entry.getKey().toString(), entry.getValue()))
                .collect(Collectors.toList());

        // 1. Best Selling Day Analysis (Feature 10)
        Map.Entry<DayOfWeek, BigDecimal> bestDayEntry = dayOfWeekMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        String bestDay = bestDayEntry != null && bestDayEntry.getValue().compareTo(BigDecimal.ZERO) > 0
                ? bestDayEntry.getKey().toString() : "N/A";
        BigDecimal bestDayRev = bestDayEntry != null ? bestDayEntry.getValue() : BigDecimal.ZERO;

        List<SalesReportDTO.SalesByDate> salesByDayOfWeekList = dayOfWeekMap.entrySet().stream()
                .map(e -> new SalesReportDTO.SalesByDate(e.getKey().name(), e.getValue()))
                .collect(Collectors.toList());

        // 2. Best Selling Week Analysis (Feature 11)
        Map.Entry<String, BigDecimal> bestWeekEntry = weekMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);
        String bestWeek = bestWeekEntry != null ? bestWeekEntry.getKey() : "N/A";
        BigDecimal bestWeekRev = bestWeekEntry != null ? bestWeekEntry.getValue() : BigDecimal.ZERO;

        // 3. Best Selling Month Analysis (Feature 12)
        Map.Entry<String, BigDecimal> bestMonthEntry = monthMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);
        String bestMonth = bestMonthEntry != null ? bestMonthEntry.getKey() : "N/A";
        BigDecimal bestMonthRev = bestMonthEntry != null ? bestMonthEntry.getValue() : BigDecimal.ZERO;

        List<SalesReportDTO.SalesByDate> salesByMonthList = monthMap.entrySet().stream()
                .map(e -> new SalesReportDTO.SalesByDate(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // Top and Slow-selling products ranking (Features 8 & 9)
        List<TopProductDTO> allProductRankings = getTopProducts();
        List<TopProductDTO> topProducts = allProductRankings.stream().limit(6).collect(Collectors.toList());
        
        List<TopProductDTO> slowProducts = new ArrayList<>(allProductRankings);
        Collections.reverse(slowProducts);
        slowProducts = slowProducts.stream().limit(5).collect(Collectors.toList());

        // Period-over-period growth calculation (Feature 13)
        Double growthPct = 0.0;
        if (prevTotalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            growthPct = (totalRevenue.subtract(prevTotalRevenue))
                    .divide(prevTotalRevenue, 4, RoundingMode.HALF_UP)
                    .doubleValue() * 100.0;
        }

        SalesReportDTO report = new SalesReportDTO();
        report.setTotalSales(totalRevenue);
        report.setTransactionCount(count);
        report.setAverageSaleValue(avgValue);
        report.setSalesByDate(salesByDate);
        report.setSalesByDayOfWeek(salesByDayOfWeekList);
        report.setSalesByMonth(salesByMonthList);
        report.setTopProducts(topProducts);
        report.setSlowProducts(slowProducts);
        report.setPaymentMethodDistribution(paymentMap);
        report.setBestSellingDay(bestDay);
        report.setBestSellingDayRevenue(bestDayRev);
        report.setBestSellingWeek(bestWeek);
        report.setBestSellingWeekRevenue(bestWeekRev);
        report.setBestSellingMonth(bestMonth);
        report.setBestSellingMonthRevenue(bestMonthRev);
        report.setPreviousPeriodSales(prevTotalRevenue);
        report.setGrowthPercentage(Math.round(growthPct * 10.0) / 10.0);

        return report;
    }

    public List<TopProductDTO> getTopProducts() {
        return saleItemRepository.findTopSellingProducts();
    }
}
