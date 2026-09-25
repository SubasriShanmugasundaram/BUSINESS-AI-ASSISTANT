package com.businessassistant.util;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MoneyUtilTest {

    @Test
    void testMultiply() {
        BigDecimal unitPrice = new BigDecimal("499.00");
        int quantity = 3;
        BigDecimal expected = new BigDecimal("1497.00");
        assertEquals(expected, MoneyUtil.multiply(unitPrice, quantity));
    }

    @Test
    void testCalculateProfitMargin() {
        BigDecimal sellingPrice = new BigDecimal("550.00");
        BigDecimal purchasePrice = new BigDecimal("420.00");
        // (550 - 420) / 550 * 100 = 130 / 550 * 100 = 23.636... -> 23.64
        BigDecimal expected = new BigDecimal("23.64");
        assertEquals(expected, MoneyUtil.calculateProfitMargin(sellingPrice, purchasePrice));
    }

    @Test
    void testRound() {
        BigDecimal amount = new BigDecimal("123.456");
        BigDecimal expected = new BigDecimal("123.46");
        assertEquals(expected, MoneyUtil.round(amount));
    }
}
