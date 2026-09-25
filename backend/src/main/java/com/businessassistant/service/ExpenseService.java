package com.businessassistant.service;

import com.businessassistant.dto.ExpenseDTO;
import com.businessassistant.dto.ExpenseSummaryDTO;
import com.businessassistant.entity.Expense;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<ExpenseDTO> getAllExpenses(String category, LocalDate startDate, LocalDate endDate, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return expenseRepository.searchExpenses(search.trim()).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        if (category != null && !category.trim().isEmpty() && startDate != null && endDate != null) {
            return expenseRepository.findByExpenseDateBetweenAndCategoryIgnoreCaseOrderByExpenseDateDesc(
                    startDate, endDate, category.trim()).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        if (category != null && !category.trim().isEmpty()) {
            return expenseRepository.findByCategoryIgnoreCaseOrderByExpenseDateDesc(category.trim()).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        if (startDate != null && endDate != null) {
            return expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(startDate, endDate).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }

        return expenseRepository.findAllByOrderByExpenseDateDescCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return toDTO(expense);
    }

    public ExpenseDTO createExpense(ExpenseDTO dto) {
        Expense expense = new Expense(
                dto.getCategory(),
                dto.getDescription(),
                dto.getAmount(),
                dto.getExpenseDate() != null ? dto.getExpenseDate() : LocalDate.now(),
                dto.getPaymentMethod(),
                dto.getNotes()
        );
        Expense saved = expenseRepository.save(expense);
        return toDTO(saved);
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO dto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        expense.setCategory(dto.getCategory());
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        if (dto.getExpenseDate() != null) {
            expense.setExpenseDate(dto.getExpenseDate());
        }
        expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setNotes(dto.getNotes());

        Expense updated = expenseRepository.save(expense);
        return toDTO(updated);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with ID: " + id);
        }
        expenseRepository.deleteById(id);
    }

    public ExpenseSummaryDTO getExpenseSummary() {
        BigDecimal totalExpenses = expenseRepository.sumTotalExpenses();
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        LocalDate today = LocalDate.now();
        BigDecimal todayExpenses = expenseRepository.sumExpensesByDate(today);
        if (todayExpenses == null) todayExpenses = BigDecimal.ZERO;

        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);
        BigDecimal thisWeekExpenses = expenseRepository.sumExpensesBetweenDates(startOfWeek, today);
        if (thisWeekExpenses == null) thisWeekExpenses = BigDecimal.ZERO;

        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        BigDecimal thisMonthExpenses = expenseRepository.sumExpensesBetweenDates(startOfMonth, endOfMonth);
        if (thisMonthExpenses == null) thisMonthExpenses = BigDecimal.ZERO;

        // Category breakdown
        List<Object[]> categoryTotals = expenseRepository.findExpenseTotalsByCategory();
        Map<String, BigDecimal> expensesByCategory = new HashMap<>();
        String highestCategory = null;
        BigDecimal highestCategoryAmount = BigDecimal.ZERO;

        for (Object[] row : categoryTotals) {
            String cat = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            expensesByCategory.put(cat, amount);

            if (highestCategory == null || amount.compareTo(highestCategoryAmount) > 0) {
                highestCategory = cat;
                highestCategoryAmount = amount;
            }
        }

        // Monthly / Daily trend (last 7 days or past 6 months)
        List<ExpenseSummaryDTO.ExpenseTrendPoint> monthlyTrend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = currentMonth.minusMonths(i);
            BigDecimal monthSum = expenseRepository.sumExpensesBetweenDates(ym.atDay(1), ym.atEndOfMonth());
            monthlyTrend.add(new ExpenseSummaryDTO.ExpenseTrendPoint(
                    ym.toString(),
                    monthSum != null ? monthSum : BigDecimal.ZERO
            ));
        }

        ExpenseSummaryDTO summary = new ExpenseSummaryDTO();
        summary.setTotalExpenses(totalExpenses);
        summary.setTodayExpenses(todayExpenses);
        summary.setThisWeekExpenses(thisWeekExpenses);
        summary.setThisMonthExpenses(thisMonthExpenses);
        summary.setHighestExpenseCategory(highestCategory != null ? highestCategory : "None");
        summary.setHighestCategoryAmount(highestCategoryAmount);
        summary.setExpensesByCategory(expensesByCategory);
        summary.setMonthlyTrend(monthlyTrend);

        return summary;
    }

    public ExpenseDTO toDTO(Expense expense) {
        return new ExpenseDTO(
                expense.getId(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getExpenseDate(),
                expense.getPaymentMethod(),
                expense.getNotes(),
                expense.getCreatedAt()
        );
    }
}
