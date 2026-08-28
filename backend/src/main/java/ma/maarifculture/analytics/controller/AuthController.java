package ma.maarifculture.analytics.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import ma.maarifculture.analytics.dto.AuthDtos.CsrfResponse;
import ma.maarifculture.analytics.dto.AuthDtos.LoginRequest;
import ma.maarifculture.analytics.dto.AuthDtos.UserProfile;
import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.repository.AppUserRepository;
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
    private final AppUserRepository users;

    public AuthController(AuthenticationManager manager, SecurityContextRepository contexts, AppUserRepository users) {
        this.manager = manager; this.contexts = contexts; this.users = users;
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
        return profile(authentication.getName());
    }

    @GetMapping("/me")
    public UserProfile me(Authentication authentication) { return profile(authentication.getName()); }

    private UserProfile profile(String email) {
        AppUser user = users.findByEmailIgnoreCase(email).orElseThrow();
        return new UserProfile(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
