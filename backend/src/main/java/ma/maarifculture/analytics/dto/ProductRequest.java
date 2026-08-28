package ma.maarifculture.analytics.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Set;

public record ProductRequest(
        @NotBlank @Size(max = 80) @Pattern(regexp = "^[A-Za-z0-9._-]+$") String sku,
        @Size(max = 20) @Pattern(regexp = "^[0-9Xx-]*$") String isbn,
        @NotBlank @Size(max = 300) String title,
        @Size(max = 4000) String description,
        @NotBlank @Pattern(regexp = "^[A-Za-z]{2,3}$") String language,
        @NotNull @DecimalMin("0.00") @Digits(integer = 17, fraction = 2) BigDecimal sellingPrice,
        @DecimalMin("0.00") @Digits(integer = 17, fraction = 2) BigDecimal purchaseCost,
        @PositiveOrZero int minimumStockThreshold,
        @PositiveOrZero Integer supplierLeadTimeDays,
        @Positive Long categoryId,
        @Positive Long publisherId,
        @Positive Long supplierId,
        @NotNull Set<@Positive Long> authorIds) {

    public ProductRequest {
        authorIds = authorIds == null ? Set.of() : Set.copyOf(authorIds);
    }
}
