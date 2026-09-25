package com.businessassistant.service;

import com.businessassistant.dto.SaleItemDTO;
import com.businessassistant.dto.SaleRequestDTO;
import com.businessassistant.dto.SaleResponseDTO;
import com.businessassistant.entity.Customer;
import com.businessassistant.entity.Inventory;
import com.businessassistant.entity.Product;
import com.businessassistant.entity.StockMovement;
import com.businessassistant.exception.BadRequestException;
import com.businessassistant.repository.CustomerRepository;
import com.businessassistant.repository.InventoryRepository;
import com.businessassistant.repository.ProductRepository;
import com.businessassistant.repository.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class SaleIntegrationTest {

    @Autowired
    private SaleService saleService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    private Customer customer;
    private Product product;

    @BeforeEach
    void setUp() {
        customer = customerRepository.save(new Customer(
                "Test Store Owner",
                "9876543210",
                "test@store.in",
                "MG Road, Bengaluru"
        ));

        product = productRepository.save(new Product(
                "Basmati Rice 5kg",
                "Groceries",
                new BigDecimal("500.00"),
                new BigDecimal("400.00"),
                "Aged Basmati"
        ));

        // Initialize inventory with 50 units
        Inventory inventory = new Inventory(product, 50, 10);
        inventoryRepository.save(inventory);
    }

    @Test
    @DisplayName("Sale Creation: Successfully creates sale, deducts inventory stock, and logs stock movement")
    void testSaleDeductsStockAndLogsMovement() {
        SaleRequestDTO request = new SaleRequestDTO();
        request.setCustomerId(customer.getId());
        request.setPaymentMethod("UPI");
        request.setSaleDate(LocalDate.now());

        SaleItemDTO item = new SaleItemDTO();
        item.setProductId(product.getId());
        item.setQuantity(5);
        item.setSellingPrice(new BigDecimal("500.00"));
        request.setItems(Collections.singletonList(item));

        SaleResponseDTO response = saleService.createSale(request);

        assertNotNull(response);
        assertEquals(new BigDecimal("2500.00"), response.getTotalAmount());
        assertEquals("UPI", response.getPaymentMethod());

        // Verify Inventory Stock Deduction
        Inventory updatedInventory = inventoryRepository.findByProductId(product.getId()).orElseThrow();
        assertEquals(45, updatedInventory.getCurrentStock());

        // Verify StockMovement Record
        List<StockMovement> movements = stockMovementRepository.findByProductIdOrderByMovementDateDescCreatedAtDesc(product.getId());
        assertFalse(movements.isEmpty());
        boolean hasSaleMovement = movements.stream().anyMatch(m -> "Sale".equalsIgnoreCase(m.getMovementType()) && m.getQuantity() == -5);
        assertTrue(hasSaleMovement, "Should have a Sale movement of -5 units");
    }

    @Test
    @DisplayName("Sale Creation: Rejects sale if requested quantity exceeds current inventory stock")
    void testSaleRejectsNegativeInventory() {
        SaleRequestDTO request = new SaleRequestDTO();
        request.setCustomerId(customer.getId());
        request.setPaymentMethod("Cash");
        request.setSaleDate(LocalDate.now());

        // Request 100 units when only 50 are in stock
        SaleItemDTO item = new SaleItemDTO();
        item.setProductId(product.getId());
        item.setQuantity(100);
        item.setSellingPrice(new BigDecimal("500.00"));
        request.setItems(Collections.singletonList(item));

        assertThrows(BadRequestException.class, () -> saleService.createSale(request));

        // Verify Stock Remains Unchanged
        Inventory inventory = inventoryRepository.findByProductId(product.getId()).orElseThrow();
        assertEquals(50, inventory.getCurrentStock());
    }
}
