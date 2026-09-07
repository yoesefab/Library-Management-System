package ma.maarifculture.analytics.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ma.maarifculture.analytics.model.UserRole;

public final class AuthDtos {
    private AuthDtos() {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record UserProfile(Long id, String fullName, String email, UserRole role) {}
    public record ProfileUpdateRequest(
            @NotBlank @Size(max = 150) String fullName,
            @NotBlank @Email @Size(max = 254) String email) {}
    public record PasswordUpdateRequest(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 12, max = 128) String newPassword) {}
    public record CsrfResponse(String headerName, String parameterName, String token) {}
    public record UserRequest(
            @NotBlank @Size(max = 150) String fullName,
            @NotBlank @Email @Size(max = 254) String email,
            @Size(min = 12, max = 128) String password,
            UserRole role,
            Boolean active) {}
    public record UserResponse(Long id, String fullName, String email, UserRole role, boolean active) {}
}
