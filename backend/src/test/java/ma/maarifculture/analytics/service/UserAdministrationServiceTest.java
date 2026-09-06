package ma.maarifculture.analytics.service;

import ma.maarifculture.analytics.dto.AuthDtos.UserRequest;
import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.model.UserRole;
import ma.maarifculture.analytics.repository.AppUserRepository;
import ma.maarifculture.analytics.repository.AuditLogRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserAdministrationServiceTest {
    @Test
    void createsInactiveAccountWhenRequested() {
        var users = mock(AppUserRepository.class);
        var encoder = mock(PasswordEncoder.class);
        when(encoder.encode(anyString())).thenReturn("encoded-test-value");
        when(users.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));
        var service = new UserAdministrationService(users, mock(AuditLogRepository.class), encoder,
                mock(CurrentUserService.class), mock(AuditService.class));
        var result = service.create(new UserRequest("Compte Démo", "demo@example.test", "SyntheticTest123!", UserRole.MANAGER, false));
        assertFalse(result.active());
    }
}
