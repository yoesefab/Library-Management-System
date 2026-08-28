package ma.maarifculture.analytics.dto;

import java.time.Instant;

public record SupplierResponse(
        Long id,
        String name,
        String contactName,
        String email,
        String phone,
        String address,
        int defaultLeadTimeDays,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {
}
