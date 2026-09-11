package ma.maarifculture.analytics.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import ma.maarifculture.analytics.dto.AuthDtos.UserProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    public static final String COOKIE_NAME = "ACCESS_TOKEN";
    private final JwtEncoder encoder;
    private final Duration lifetime;
    private final String issuer;
    private final String audience;
    private final boolean secureCookie;

    public JwtService(
            JwtEncoder encoder,
            @Value("${maarif.jwt.access-token-lifetime:15m}") Duration lifetime,
            @Value("${maarif.jwt.issuer}") String issuer,
            @Value("${maarif.jwt.audience}") String audience,
            @Value("${maarif.jwt.secure-cookie:false}") boolean secureCookie) {
        if (lifetime.isNegative() || lifetime.isZero() || lifetime.compareTo(Duration.ofHours(1)) > 0) {
            throw new IllegalArgumentException("La durée du jeton d’accès doit être comprise entre 1 seconde et 1 heure.");
        }
        this.encoder = encoder;
        this.lifetime = lifetime;
        this.issuer = issuer;
        this.audience = audience;
        this.secureCookie = secureCookie;
    }

    public ResponseCookie accessCookie(UserProfile user) {
        Instant issuedAt = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .audience(List.of(audience))
                .issuedAt(issuedAt)
                .expiresAt(issuedAt.plus(lifetime))
                .id(UUID.randomUUID().toString())
                .subject(user.email())
                .claim("role", user.role().name()).build();
        String token = encoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true).secure(secureCookie).sameSite("Strict").path("/")
                .maxAge(lifetime).build();
    }

    public ResponseCookie expiredCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true).secure(secureCookie).sameSite("Strict").path("/")
                .maxAge(Duration.ZERO).build();
    }
}
