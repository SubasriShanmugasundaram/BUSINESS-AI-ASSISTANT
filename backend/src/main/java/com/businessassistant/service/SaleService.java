package com.businessassistant.service;

import com.businessassistant.dto.SaleItemDTO;
import com.businessassistant.dto.SaleRequestDTO;
import com.businessassistant.dto.SaleResponseDTO;
import com.businessassistant.entity.Customer;
import com.businessassistant.entity.Product;
import com.businessassistant.entity.Sale;
import com.businessassistant.entity.SaleItem;
import com.businessassistant.exception.BadRequestException;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.CustomerRepository;
import com.businessassistant.repository.ProductRepository;
import com.businessassistant.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

    public SaleService(SaleRepository saleRepository,
                       CustomerRepository customerRepository,
                       ProductRepository productRepository,
                       InventoryService inventoryService) {
        this.saleRepository = saleRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
    }

    public List<SaleResponseDTO> getAllSales() {
        return saleRepository.findAllByOrderBySaleDateDescCreatedAtDesc().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public SaleResponseDTO getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with ID: " + id));
        return toResponseDTO(sale);
    }

    public SaleResponseDTO createSale(SaleRequestDTO request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Sale must contain at least one product item");
        }

        LocalDate saleDate = request.getSaleDate() != null ? request.getSaleDate() : LocalDate.now();

        // Generate Unique Sale Number: INV-YYYY-XXXX
        long totalSalesCount = saleRepository.count();
        String saleNumber = String.format("INV-%d-%04d", Year.now().getValue(), totalSalesCount + 1);

        BigDecimal totalAmount = BigDecimal.ZERO;
        Sale sale = new Sale(
                saleNumber,
                customer,
                BigDecimal.ZERO,
                request.getPaymentMethod(),
                saleDate,
                request.getNotes()
        );

        for (SaleItemDTO itemDTO : request.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + itemDTO.getProductId()));

            int qty = itemDTO.getQuantity() != null && itemDTO.getQuantity() > 0 ? itemDTO.getQuantity() : 1;
            BigDecimal price = itemDTO.getSellingPrice() != null ? itemDTO.getSellingPrice() : product.getSellingPrice();
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(qty));

            SaleItem item = new SaleItem(product, qty, price, lineTotal);
            sale.addItem(item);
            totalAmount = totalAmount.add(lineTotal);
        }

        sale.setTotalAmount(totalAmount);
        Sale savedSale = saleRepository.save(sale);

        // Automatically deduct inventory stock & log stock movements
        for (SaleItem item : savedSale.getItems()) {
            inventoryService.deductStockForSale(savedSale.getSaleNumber(), item.getProduct(), item.getQuantity());
        }

        return toResponseDTO(savedSale);
    }

    public SaleResponseDTO updateSale(Long id, SaleRequestDTO request) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with ID: " + id));

        if (request.getPaymentMethod() != null) {
            sale.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getNotes() != null) {
            sale.setNotes(request.getNotes());
        }
        if (request.getSaleDate() != null) {
            sale.setSaleDate(request.getSaleDate());
        }

        Sale updated = saleRepository.save(sale);
        return toResponseDTO(updated);
    }

    public void deleteSale(Long id) {
        if (!saleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sale not found with ID: " + id);
        }
        saleRepository.deleteById(id);
    }

    public SaleResponseDTO toResponseDTO(Sale sale) {
        SaleResponseDTO dto = new SaleResponseDTO();
        dto.setId(sale.getId());
        dto.setSaleNumber(sale.getSaleNumber());
        dto.setCustomerId(sale.getCustomer().getId());
        dto.setCustomerName(sale.getCustomer().getName());
        dto.setCustomerPhone(sale.getCustomer().getPhone());
        dto.setCustomerAddress(sale.getCustomer().getAddress());
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setPaymentMethod(sale.getPaymentMethod());
        dto.setSaleDate(sale.getSaleDate());
        dto.setStatus(sale.getStatus());
        dto.setNotes(sale.getNotes());
        dto.setCreatedAt(sale.getCreatedAt());

        List<SaleItemDTO> itemDTOs = sale.getItems().stream().map(i -> {
            SaleItemDTO itemDTO = new SaleItemDTO();
            itemDTO.setId(i.getId());
            itemDTO.setProductId(i.getProduct().getId());
            itemDTO.setProductName(i.getProduct().getName());
            itemDTO.setCategory(i.getProduct().getCategory());
            itemDTO.setQuantity(i.getQuantity());
            itemDTO.setSellingPrice(i.getSellingPrice());
            itemDTO.setTotalAmount(i.getTotalAmount());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
