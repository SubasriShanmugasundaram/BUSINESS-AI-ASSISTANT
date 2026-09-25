package com.businessassistant.controller;

import com.businessassistant.dto.ExpenseDTO;
import com.businessassistant.dto.ExpenseSummaryDTO;
import com.businessassistant.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(expenseService.getAllExpenses(category, startDate, endDate, search));
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryDTO> getExpenseSummary() {
        return ResponseEntity.ok(expenseService.getExpenseSummary());
    }

    @GetMapping("/summary/by-category")
    public ResponseEntity<java.util.Map<String, java.math.BigDecimal>> getExpensesByCategory() {
        return ResponseEntity.ok(expenseService.getExpenseSummary().getExpensesByCategory());
    }

    @GetMapping("/total")
    public ResponseEntity<java.math.BigDecimal> getTotalExpenses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ExpenseDTO> expenses = expenseService.getAllExpenses(null, startDate, endDate, null);
        java.math.BigDecimal total = expenses.stream()
                .map(ExpenseDTO::getAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody ExpenseDTO dto) {
        ExpenseDTO created = expenseService.createExpense(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, @Valid @RequestBody ExpenseDTO dto) {
        ExpenseDTO updated = expenseService.updateExpense(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
