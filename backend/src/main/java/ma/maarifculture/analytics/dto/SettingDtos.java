package ma.maarifculture.analytics.dto;
import jakarta.validation.constraints.NotBlank;import jakarta.validation.constraints.Size;import java.time.Instant;
public final class SettingDtos {private SettingDtos(){} public record SettingRequest(@NotBlank @Size(max=2000) String value,@Size(max=500) String description){} public record SettingResponse(String key,String value,String description,Instant updatedAt){} }
