package com.businessassistant.service;

import com.businessassistant.dto.ExpenseDTO;
import com.businessassistant.dto.GstReminderDTO;
import com.businessassistant.dto.GstSummaryDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class GstAndExpenseTest {

    @Autowired
    private GstService gstService;

    @Autowired
    private ExpenseService expenseService;

    @Test
    @DisplayName("GST: Computes GST summary from real sales (18% tax breakdown)")
    void testGstSummary() {
        GstSummaryDTO summary = gstService.getGstSummary();
        assertNotNull(summary);
        assertNotNull(summary.getGstin());
        assertNotNull(summary.getTotalTaxableSales());
        assertNotNull(summary.getTotalGstCollected());
        assertNotNull(summary.getTotalCgst());
        assertNotNull(summary.getTotalSgst());

        // CGST and SGST together equal total GST collected
        assertEquals(summary.getTotalGstCollected(), summary.getTotalCgst().add(summary.getTotalSgst()));
    }

    @Test
    @DisplayName("GST: Create, retrieve, and toggle GST reminder")
    void testGstReminderLifecycle() {
        GstReminderDTO dto = new GstReminderDTO();
        dto.setTitle("Test GSTR-1 Q3 Filing");
        dto.setDescription("File quarterly return before 11th");
        dto.setDueDate(LocalDate.now().plusDays(10));
        dto.setStatus("PENDING");

        GstReminderDTO created = gstService.createReminder(dto);
        assertNotNull(created.getId());
        assertEquals("PENDING", created.getStatus());

        List<GstReminderDTO> list = gstService.getReminders();
        assertTrue(list.stream().anyMatch(r -> r.getId().equals(created.getId())));

        // Update reminder
        created.setStatus("COMPLETED");
        GstReminderDTO updated = gstService.updateReminder(created.getId(), created);
        assertEquals("COMPLETED", updated.getStatus());
    }

    @Test
    @DisplayName("Expense: Create expense and verify expense total calculation")
    void testExpenseTracking() {
        ExpenseDTO exp = new ExpenseDTO();
        exp.setDescription("Electricity Bill for Shop");
        exp.setCategory("Electricity");
        exp.setAmount(new BigDecimal("3500.00"));
        exp.setPaymentMethod("UPI");
        exp.setExpenseDate(LocalDate.now());

        ExpenseDTO created = expenseService.createExpense(exp);
        assertNotNull(created.getId());
        assertEquals(new BigDecimal("3500.00"), created.getAmount());

        List<ExpenseDTO> expenses = expenseService.getAllExpenses("Electricity", null, null, null);
        assertTrue(expenses.stream().anyMatch(e -> e.getId().equals(created.getId())));
    }
}
