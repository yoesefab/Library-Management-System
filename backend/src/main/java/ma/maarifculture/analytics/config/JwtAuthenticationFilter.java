package ma.maarifculture.analytics.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import ma.maarifculture.analytics.service.CustomUserDetailsService;
import ma.maarifculture.analytics.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtDecoder decoder;
    private final CustomUserDetailsService users;

    public JwtAuthenticationFilter(JwtDecoder decoder, CustomUserDetailsService users) {
        this.decoder = decoder;
        this.users = users;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = cookie(request);
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                var jwt = decoder.decode(token);
                var user = users.loadUserByUsername(jwt.getSubject());
                if (!user.isEnabled()) {
                    chain.doFilter(request, response);
                    return;
                }
                SecurityContextHolder.getContext().setAuthentication(
                        UsernamePasswordAuthenticationToken.authenticated(user, null, user.getAuthorities()));
            } catch (JwtException | org.springframework.security.core.userdetails.UsernameNotFoundException ignored) {
                // An invalid, expired, or deactivated identity remains anonymous.
            }
        }
        chain.doFilter(request, response);
    }

    private String cookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(cookie -> JwtService.COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(value -> !value.isBlank())
                .findFirst().orElse(null);
    }
}
