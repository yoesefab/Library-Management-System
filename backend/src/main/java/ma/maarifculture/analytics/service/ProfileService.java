package ma.maarifculture.analytics.service;

import ma.maarifculture.analytics.dto.AuthDtos.PasswordUpdateRequest;
import ma.maarifculture.analytics.dto.AuthDtos.ProfileUpdateRequest;
import ma.maarifculture.analytics.dto.AuthDtos.UserProfile;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {
    private final CurrentUserService currentUser;
    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuditService audit;

    public ProfileService(CurrentUserService currentUser, AppUserRepository users,
            PasswordEncoder passwordEncoder, AuditService audit) {
        this.currentUser = currentUser;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public UserProfile getProfile() {
        return toProfile(currentUser.required());
    }

    @Transactional
    public UserProfile updateProfile(ProfileUpdateRequest request) {
        AppUser user = currentUser.required();
        if (users.existsByEmailIgnoreCaseAndIdNot(request.email().trim(), user.getId())) {
            throw new ConflictException("Cette adresse e-mail est déjà utilisée.");
        }
        user.update(request.fullName(), request.email(), user.getRole());
        audit.record(user, "PROFILE_UPDATED", "APP_USER", user.getId(), null);
        return toProfile(user);
    }

    @Transactional
    public void updatePassword(PasswordUpdateRequest request) {
        AppUser user = currentUser.required();
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Le mot de passe actuel est incorrect.");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Le nouveau mot de passe doit être différent du mot de passe actuel.");
        }
        user.changePassword(passwordEncoder.encode(request.newPassword()));
        audit.record(user, "PASSWORD_UPDATED", "APP_USER", user.getId(), null);
    }

    private UserProfile toProfile(AppUser user) {
        return new UserProfile(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
