package ma.maarifculture.analytics.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ma.maarifculture.analytics.dto.AuthDtos.PasswordUpdateRequest;
import ma.maarifculture.analytics.dto.AuthDtos.ProfileUpdateRequest;
import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.model.UserRole;
import ma.maarifculture.analytics.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class ProfileServiceTest {
    @Test
    void updatesTheCurrentUsersInformationWithoutChangingTheirRole() {
        AppUser user = new AppUser("Ancien nom", "old@example.test", "hash", UserRole.MANAGER);
        CurrentUserService currentUser = mock(CurrentUserService.class);
        AppUserRepository users = mock(AppUserRepository.class);
        when(currentUser.required()).thenReturn(user);

        ProfileService service = new ProfileService(currentUser, users, mock(PasswordEncoder.class), mock(AuditService.class));
        var result = service.updateProfile(new ProfileUpdateRequest("  Nouveau nom  ", "NEW@example.test"));

        assertEquals("Nouveau nom", result.fullName());
        assertEquals("new@example.test", result.email());
        assertEquals(UserRole.MANAGER, result.role());
    }

    @Test
    void rejectsAnIncorrectCurrentPassword() {
        AppUser user = new AppUser("Compte test", "user@example.test", "old-hash", UserRole.STOCK_EMPLOYEE);
        CurrentUserService currentUser = mock(CurrentUserService.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        when(currentUser.required()).thenReturn(user);
        when(encoder.matches(anyString(), anyString())).thenReturn(false);
        ProfileService service = new ProfileService(currentUser, mock(AppUserRepository.class), encoder, mock(AuditService.class));

        assertThrows(IllegalArgumentException.class,
                () -> service.updatePassword(new PasswordUpdateRequest("incorrect-password", "a-new-secure-password")));
        verify(encoder, never()).encode(anyString());
    }

    @Test
    void hashesTheNewPasswordAfterCurrentPasswordVerification() {
        AppUser user = new AppUser("Compte test", "user@example.test", "old-hash", UserRole.ADMINISTRATOR);
        CurrentUserService currentUser = mock(CurrentUserService.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        when(currentUser.required()).thenReturn(user);
        when(encoder.matches("current-password", "old-hash")).thenReturn(true);
        when(encoder.matches("a-new-secure-password", "old-hash")).thenReturn(false);
        when(encoder.encode("a-new-secure-password")).thenReturn("new-hash");
        ProfileService service = new ProfileService(currentUser, mock(AppUserRepository.class), encoder, mock(AuditService.class));

        service.updatePassword(new PasswordUpdateRequest("current-password", "a-new-secure-password"));

        assertEquals("new-hash", user.getPasswordHash());
    }
}
