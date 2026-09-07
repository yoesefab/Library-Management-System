package ma.maarifculture.analytics.dto;

import java.math.BigDecimal;

public record ProductSummaryResponse(
        Long id,
        String sku,
        String isbn,
        String title,
        String imageUrl,
        String language,
        BigDecimal sellingPrice,
        String category,
        String publisher,
        boolean active) {
}
