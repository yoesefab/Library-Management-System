package ma.maarifculture.analytics.service;

import ma.maarifculture.analytics.dto.AuthDtos.UserRequest;
import ma.maarifculture.analytics.dto.AuthDtos.UserResponse;
import ma.maarifculture.analytics.dto.AuditLogResponse;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.repository.AppUserRepository;
import ma.maarifculture.analytics.repository.AuditLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserAdministrationService {
    private final AppUserRepository users;
    private final AuditLogRepository logs;
    private final PasswordEncoder encoder;
    private final CurrentUserService currentUser;
    private final AuditService audit;

    public UserAdministrationService(AppUserRepository users, AuditLogRepository logs, PasswordEncoder encoder,
            CurrentUserService currentUser, AuditService audit) {
        this.users = users; this.logs = logs; this.encoder = encoder; this.currentUser = currentUser; this.audit = audit;
    }

    public PageResponse<UserResponse> list(String query, int page, int size) {
        String q = query == null ? "" : query.trim();
        return PageResponse.from(users.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                q, q, PageRequest.of(page, size, Sort.by("fullName"))).map(this::response));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        if (request.password() == null || request.role() == null) throw new IllegalArgumentException("Mot de passe et rôle requis.");
        if (users.existsByEmailIgnoreCase(request.email())) throw new ConflictException("Cet email est déjà utilisé.");
        AppUser user = users.save(new AppUser(request.fullName(), request.email(), encoder.encode(request.password()), request.role()));
        audit.record(currentUser.required(), "USER_CREATED", "AppUser", user.getId(), "role=" + user.getRole());
        return response(user);
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        AppUser user = required(id);
        if (users.existsByEmailIgnoreCaseAndIdNot(request.email(), id)) throw new ConflictException("Cet email est déjà utilisé.");
        user.update(request.fullName(), request.email(), request.role() == null ? user.getRole() : request.role());
        if (request.password() != null && !request.password().isBlank()) user.changePassword(encoder.encode(request.password()));
        if (request.active() != null) user.setActive(request.active());
        audit.record(currentUser.required(), "USER_UPDATED", "AppUser", id, "role=" + user.getRole() + ",active=" + user.isActive());
        return response(user);
    }

    public PageResponse<AuditLogResponse> auditLogs(int page, int size) {
        return PageResponse.from(logs.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "occurredAt")))
                .map(log -> new AuditLogResponse(log.getId(), log.getUser() == null ? null : log.getUser().getId(),
                        log.getUser() == null ? null : log.getUser().getEmail(), log.getAction(), log.getEntityType(),
                        log.getEntityId(), log.getOccurredAt(), log.getMetadata())));
    }

    private AppUser required(Long id) { return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + id)); }
    private UserResponse response(AppUser u) { return new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole(), u.isActive()); }
}
