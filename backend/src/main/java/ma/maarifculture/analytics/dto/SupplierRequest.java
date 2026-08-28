package ma.maarifculture.analytics.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SupplierRequest(
        @NotBlank @Size(max = 180) String name,
        @Size(max = 150) String contactName,
        @Email @Size(max = 254) String email,
        @Size(max = 40) String phone,
        @Size(max = 500) String address,
        @PositiveOrZero int defaultLeadTimeDays) {
}
