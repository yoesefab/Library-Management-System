package ma.maarifculture.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NamedReferenceRequest(@NotBlank @Size(max = 180) String name) {
}
