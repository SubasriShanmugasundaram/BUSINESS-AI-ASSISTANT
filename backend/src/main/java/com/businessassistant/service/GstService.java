package com.businessassistant.service;

import com.businessassistant.dto.GstReminderDTO;
import com.businessassistant.dto.GstSummaryDTO;
import com.businessassistant.entity.BusinessProfile;
import com.businessassistant.entity.GstReminder;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.BusinessProfileRepository;
import com.businessassistant.repository.GstReminderRepository;
import com.businessassistant.repository.SaleRepository;
import com.businessassistant.util.MoneyUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GstService {

    private final GstReminderRepository reminderRepository;
    private final SaleRepository saleRepository;
    private final BusinessProfileRepository businessProfileRepository;

    public GstService(GstReminderRepository reminderRepository,
                      SaleRepository saleRepository,
                      BusinessProfileRepository businessProfileRepository) {
        this.reminderRepository = reminderRepository;
        this.saleRepository = saleRepository;
        this.businessProfileRepository = businessProfileRepository;
    }

    public GstSummaryDTO getGstSummary() {
        BusinessProfile profile = businessProfileRepository.findFirstByOrderByIdAsc()
                .orElse(null);
        String gstin = (profile != null && profile.getGstin() != null) ? profile.getGstin() : "29ABCDE1234F1Z5";

        BigDecimal totalGrossSales = saleRepository.findAll().stream()
                .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Standard GST extraction (assuming 18% standard rate: Taxable = Gross / 1.18, GST = Gross - Taxable)
        BigDecimal divisor = new BigDecimal("1.18");
        BigDecimal taxableSales = totalGrossSales.divide(divisor, 2, RoundingMode.HALF_UP);
        BigDecimal totalGst = totalGrossSales.subtract(taxableSales);

        // Split equal CGST (9%) and SGST (9%)
        BigDecimal cgst = totalGst.divide(new BigDecimal("2.0"), 2, RoundingMode.HALF_UP);
        BigDecimal sgst = totalGst.subtract(cgst);
        BigDecimal igst = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        long invoiceCount = saleRepository.findAll().stream()
                .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                .count();

        List<GstReminderDTO> reminders = getReminders();

        return new GstSummaryDTO(
                gstin,
                taxableSales,
                totalGst,
                cgst,
                sgst,
                igst,
                (int) invoiceCount,
                reminders
        );
    }

    public List<GstReminderDTO> getReminders() {
        return reminderRepository.findAllByOrderByDueDateAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GstReminderDTO createReminder(GstReminderDTO dto) {
        GstReminder reminder = new GstReminder(
                dto.getTitle(),
                dto.getDescription(),
                dto.getDueDate() != null ? dto.getDueDate() : LocalDate.now().plusDays(20),
                dto.getStatus() != null ? dto.getStatus() : "PENDING"
        );
        reminder = reminderRepository.save(reminder);
        return toDTO(reminder);
    }

    @Transactional
    public GstReminderDTO updateReminder(Long id, GstReminderDTO dto) {
        GstReminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GST Reminder not found with id: " + id));

        if (dto.getTitle() != null) reminder.setTitle(dto.getTitle());
        if (dto.getDescription() != null) reminder.setDescription(dto.getDescription());
        if (dto.getDueDate() != null) reminder.setDueDate(dto.getDueDate());
        if (dto.getStatus() != null) reminder.setStatus(dto.getStatus());

        reminder = reminderRepository.save(reminder);
        return toDTO(reminder);
    }

    @Transactional
    public void deleteReminder(Long id) {
        if (!reminderRepository.existsById(id)) {
            throw new ResourceNotFoundException("GST Reminder not found with id: " + id);
        }
        reminderRepository.deleteById(id);
    }

    private GstReminderDTO toDTO(GstReminder r) {
        return new GstReminderDTO(
                r.getId(),
                r.getTitle(),
                r.getDescription(),
                r.getDueDate(),
                r.getStatus(),
                r.getCreatedAt()
        );
    }
}
