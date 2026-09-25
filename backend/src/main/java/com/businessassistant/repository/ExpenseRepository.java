package com.businessassistant.repository;

import com.businessassistant.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByExpenseDateDescCreatedAtDesc();

    List<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(LocalDate startDate, LocalDate endDate);

    List<Expense> findByCategoryIgnoreCaseOrderByExpenseDateDesc(String category);

    List<Expense> findByExpenseDateBetweenAndCategoryIgnoreCaseOrderByExpenseDateDesc(
            LocalDate startDate, LocalDate endDate, String category);

    @Query("SELECT e FROM Expense e WHERE " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(COALESCE(e.notes, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY e.expenseDate DESC, e.createdAt DESC")
    List<Expense> searchExpenses(@Param("keyword") String keyword);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    BigDecimal sumTotalExpenses();

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate = :date")
    BigDecimal sumExpensesByDate(@Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumExpensesBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.category, SUM(e.amount), COUNT(e) FROM Expense e GROUP BY e.category ORDER BY SUM(e.amount) DESC")
    List<Object[]> findExpenseTotalsByCategory();
}
