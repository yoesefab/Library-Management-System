package ma.maarifculture.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CategoryRequest(@NotBlank @Size(max = 120) String name, @Positive Long parentId) {
}
