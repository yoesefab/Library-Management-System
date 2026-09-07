package ma.maarifculture.analytics.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import ma.maarifculture.analytics.dto.AuthDtos.CsrfResponse;
import ma.maarifculture.analytics.dto.AuthDtos.LoginRequest;
import ma.maarifculture.analytics.dto.AuthDtos.PasswordUpdateRequest;
import ma.maarifculture.analytics.dto.AuthDtos.ProfileUpdateRequest;
import ma.maarifculture.analytics.dto.AuthDtos.UserProfile;
import ma.maarifculture.analytics.service.ProfileService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager manager;
    private final SecurityContextRepository contexts;
    private final ProfileService profiles;

    public AuthController(AuthenticationManager manager, SecurityContextRepository contexts, ProfileService profiles) {
        this.manager = manager; this.contexts = contexts; this.profiles = profiles;
    }

    @GetMapping("/csrf")
    public CsrfResponse csrf(CsrfToken token) { return new CsrfResponse(token.getHeaderName(), token.getParameterName(), token.getToken()); }

    @PostMapping("/login")
    public UserProfile login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse response) {
        Authentication authentication = manager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.email(), request.password()));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        contexts.saveContext(context, httpRequest, response);
        return profiles.getProfile();
    }

    @GetMapping("/me") public UserProfile me() { return profiles.getProfile(); }

    @PutMapping("/me")
    public UserProfile updateProfile(@Valid @RequestBody ProfileUpdateRequest request,
            HttpServletRequest httpRequest, HttpServletResponse response) {
        UserProfile profile = profiles.updateProfile(request);
        Authentication previous = SecurityContextHolder.getContext().getAuthentication();
        Authentication updated = UsernamePasswordAuthenticationToken.authenticated(
                profile.email(), previous.getCredentials(), previous.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(updated);
        contexts.saveContext(SecurityContextHolder.getContext(), httpRequest, response);
        return profile;
    }

    @PutMapping("/me/password")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void updatePassword(@Valid @RequestBody PasswordUpdateRequest request) {
        profiles.updatePassword(request);
    }
}
