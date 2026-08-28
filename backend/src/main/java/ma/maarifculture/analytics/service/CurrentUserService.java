package ma.maarifculture.analytics.service;

import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
    private final AppUserRepository users;
    public CurrentUserService(AppUserRepository users) { this.users = users; }
    public AppUser required() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new ResourceNotFoundException("Utilisateur authentifié introuvable.");
        }
        return users.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur authentifié introuvable."));
    }
}
