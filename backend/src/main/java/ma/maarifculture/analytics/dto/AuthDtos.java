package ma.maarifculture.analytics.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import ma.maarifculture.analytics.model.UserRole;

public final class AuthDtos {
    private AuthDtos() {}

    public record LoginRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(max = 128) String password) {}
    public record UserProfile(Long id, String fullName, String email, UserRole role) {}
    public record ProfileUpdateRequest(
            @NotBlank @Size(max = 150) String fullName,
            @NotBlank @Email @Size(max = 254) String email) {}
    public record PasswordUpdateRequest(
            @NotBlank @Size(max = 128) String currentPassword,
            @NotBlank @Size(min = 12, max = 128)
            @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
                    message = "doit contenir une minuscule, une majuscule et un chiffre") String newPassword) {}
    public record CsrfResponse(String headerName, String parameterName, String token) {}
    public record UserRequest(
            @NotBlank @Size(max = 150) String fullName,
            @NotBlank @Email @Size(max = 254) String email,
            @Size(min = 12, max = 128)
            @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
                    message = "doit contenir une minuscule, une majuscule et un chiffre") String password,
            UserRole role,
            Boolean active) {}
    public record UserResponse(Long id, String fullName, String email, UserRole role, boolean active) {}
}
