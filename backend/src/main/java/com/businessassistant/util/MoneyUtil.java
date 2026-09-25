package com.businessassistant.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Standard utility for precise monetary calculations across BizPartner AI.
 * Ensures consistent 2-decimal scale and Banker's / HALF_UP rounding.
 */
public final class MoneyUtil {

    public static final int DEFAULT_SCALE = 2;
    public static final RoundingMode DEFAULT_ROUNDING = RoundingMode.HALF_UP;

    private MoneyUtil() {
        // Utility class
    }

    public static BigDecimal round(BigDecimal amount) {
        if (amount == null) {
            return BigDecimal.ZERO.setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
        }
        return amount.setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
    }

    public static BigDecimal multiply(BigDecimal unitPrice, int quantity) {
        if (unitPrice == null) {
            return BigDecimal.ZERO.setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
        }
        return unitPrice.multiply(BigDecimal.valueOf(quantity)).setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
    }

    public static BigDecimal calculateProfitMargin(BigDecimal sellingPrice, BigDecimal purchasePrice) {
        if (sellingPrice == null || purchasePrice == null || sellingPrice.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
        }
        BigDecimal profit = sellingPrice.subtract(purchasePrice);
        return profit.divide(sellingPrice, 4, DEFAULT_ROUNDING)
                     .multiply(BigDecimal.valueOf(100))
                     .setScale(DEFAULT_SCALE, DEFAULT_ROUNDING);
    }
}
