package com.businessassistant.service;

import com.businessassistant.dto.StockMovementDTO;
import com.businessassistant.entity.StockMovement;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;

    public StockMovementService(StockMovementRepository stockMovementRepository) {
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<StockMovementDTO> getAllMovements(Long productId, String movementType,
                                                  LocalDate startDate, LocalDate endDate,
                                                  String search) {
        if (search != null && !search.trim().isEmpty()) {
            return stockMovementRepository.searchMovements(search.trim()).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        if (productId != null) {
            return stockMovementRepository.findByProductIdOrderByMovementDateDescCreatedAtDesc(productId).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        if (movementType != null && !movementType.trim().isEmpty()) {
            return stockMovementRepository.findByMovementTypeIgnoreCaseOrderByMovementDateDescCreatedAtDesc(movementType.trim()).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        if (startDate != null && endDate != null) {
            return stockMovementRepository.findByMovementDateBetweenOrderByMovementDateDescCreatedAtDesc(startDate, endDate).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        return stockMovementRepository.findAllByOrderByMovementDateDescCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StockMovementDTO getMovementById(Long id) {
        StockMovement movement = stockMovementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock movement not found with ID: " + id));
        return toDTO(movement);
    }

    public StockMovementDTO toDTO(StockMovement m) {
        return new StockMovementDTO(
                m.getId(),
                m.getProduct().getId(),
                m.getProduct().getName(),
                m.getProduct().getSku(),
                m.getProduct().getCategory(),
                m.getMovementType(),
                m.getQuantity(),
                m.getMovementDate(),
                m.getReason(),
                m.getReferenceId(),
                m.getCreatedAt()
        );
    }
}
