package ma.maarifculture.analytics.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import ma.maarifculture.analytics.dto.AuthDtos.CsrfResponse;
import ma.maarifculture.analytics.dto.AuthDtos.LoginRequest;
import ma.maarifculture.analytics.dto.AuthDtos.PasswordUpdateRequest;
import ma.maarifculture.analytics.dto.AuthDtos.ProfileUpdateRequest;
import ma.maarifculture.analytics.dto.AuthDtos.UserProfile;
import ma.maarifculture.analytics.service.ProfileService;
import ma.maarifculture.analytics.service.JwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager manager;
    private final ProfileService profiles;
    private final JwtService jwt;

    public AuthController(AuthenticationManager manager, ProfileService profiles, JwtService jwt) {
        this.manager = manager; this.profiles = profiles; this.jwt = jwt;
    }

    @GetMapping("/csrf")
    public CsrfResponse csrf(CsrfToken token) { return new CsrfResponse(token.getHeaderName(), token.getParameterName(), token.getToken()); }

    @PostMapping("/login")
    public UserProfile login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        Authentication authentication = manager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.email(), request.password()));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        UserProfile profile = profiles.getProfile();
        response.addHeader(HttpHeaders.SET_COOKIE, jwt.accessCookie(profile).toString());
        return profile;
    }

    @GetMapping("/me") public UserProfile me() { return profiles.getProfile(); }

    @PutMapping("/me")
    public UserProfile updateProfile(@Valid @RequestBody ProfileUpdateRequest request, HttpServletResponse response) {
        UserProfile profile = profiles.updateProfile(request);
        Authentication previous = SecurityContextHolder.getContext().getAuthentication();
        Authentication updated = UsernamePasswordAuthenticationToken.authenticated(
                profile.email(), previous.getCredentials(), previous.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(updated);
        response.addHeader(HttpHeaders.SET_COOKIE, jwt.accessCookie(profile).toString());
        return profile;
    }

    @PutMapping("/me/password")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void updatePassword(@Valid @RequestBody PasswordUpdateRequest request, HttpServletResponse response) {
        profiles.updatePassword(request);
        response.addHeader(HttpHeaders.SET_COOKIE, jwt.expiredCookie().toString());
        SecurityContextHolder.clearContext();
    }
}
