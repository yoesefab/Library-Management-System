package ma.maarifculture.analytics.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductDetailResponse(
        Long id,
        String sku,
        String isbn,
        String title,
        String description,
        String language,
        BigDecimal sellingPrice,
        BigDecimal purchaseCost,
        int minimumStockThreshold,
        Integer supplierLeadTimeDays,
        Reference category,
        Reference publisher,
        Reference supplier,
        List<Reference> authors,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {

    public record Reference(Long id, String name) {
    }
}
