package com.businessassistant.service;

import com.businessassistant.dto.DashboardStatsDTO;
import com.businessassistant.dto.SaleResponseDTO;
import com.businessassistant.repository.CustomerRepository;
import com.businessassistant.repository.ProductRepository;
import com.businessassistant.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final SaleService saleService;

    public DashboardService(CustomerRepository customerRepository, ProductRepository productRepository, SaleRepository saleRepository, SaleService saleService) {
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.saleService = saleService;
    }

    public DashboardStatsDTO getDashboardStats() {
        long totalCustomers = customerRepository.count();
        long totalProducts = productRepository.count();
        BigDecimal todaySales = saleRepository.sumTotalAmountBySaleDate(LocalDate.now());
        BigDecimal totalSales = saleRepository.sumTotalAmount();
        long totalTransactions = saleRepository.countTotalTransactions();

        List<SaleResponseDTO> recentSales = saleRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(saleService::toResponseDTO)
                .collect(Collectors.toList());

        return new DashboardStatsDTO(
                totalCustomers,
                totalProducts,
                todaySales != null ? todaySales : BigDecimal.ZERO,
                totalSales != null ? totalSales : BigDecimal.ZERO,
                totalTransactions,
                recentSales
        );
    }
}
