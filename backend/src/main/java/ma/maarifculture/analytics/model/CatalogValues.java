package ma.maarifculture.analytics.model;

import java.math.BigDecimal;
import java.util.Objects;

final class CatalogValues {

    private CatalogValues() {
    }

    static String requiredText(String value, String label) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(label + " must not be blank");
        }
        return value.trim();
    }

    static String optionalText(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    static int nonNegative(int value, String label) {
        if (value < 0) {
            throw new IllegalArgumentException(label + " must not be negative");
        }
        return value;
    }

    static BigDecimal money(BigDecimal value, String label) {
        Objects.requireNonNull(value, label + " must not be null");
        if (value.signum() < 0 || value.scale() > 2) {
            throw new IllegalArgumentException(label + " must be non-negative with at most 2 decimals");
        }
        return value;
    }

    static <T> T required(T value, String label) {
        return Objects.requireNonNull(value, label + " must not be null");
    }
}
