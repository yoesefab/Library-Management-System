package ma.maarifculture.analytics.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwsHeader;

class JwtSecurityTest {
    private static final String SECRET = "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=";
    private final SecurityConfiguration configuration = new SecurityConfiguration();

    @Test
    void validatesSignatureIssuerAudienceExpirationAndRequiredClaims() {
        var encoder = configuration.jwtEncoder(SECRET);
        var decoder = configuration.jwtDecoder(SECRET, "issuer", "audience");
        Instant now = Instant.now();
        JwtClaimsSet valid = JwtClaimsSet.builder()
                .issuer("issuer").audience(List.of("audience"))
                .issuedAt(now).expiresAt(now.plusSeconds(60))
                .subject("user@example.test").id("token-id")
                .claim("role", "MANAGER").build();

        String token = encoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), valid)).getTokenValue();
        assertThat(decoder.decode(token).getSubject()).isEqualTo("user@example.test");

        assertRejected(encoder, decoder, claims("issuer", "other", now, now.plusSeconds(60), true), MacAlgorithm.HS256);
        assertRejected(encoder, decoder, claims("other", "audience", now, now.plusSeconds(60), true), MacAlgorithm.HS256);
        assertRejected(encoder, decoder, claims("issuer", "audience", now.minusSeconds(60), now.minusSeconds(1), true), MacAlgorithm.HS256);
        assertRejected(encoder, decoder, JwtClaimsSet.builder()
                .issuer("issuer").audience(List.of("audience"))
                .issuedAt(now).expiresAt(now.plusSeconds(60)).subject("user@example.test").build(), MacAlgorithm.HS256);
        String longSecret = java.util.Base64.getEncoder().encodeToString(new byte[64]);
        assertRejected(configuration.jwtEncoder(longSecret),
                configuration.jwtDecoder(longSecret, "issuer", "audience"), valid, MacAlgorithm.HS512);
    }

    private JwtClaimsSet claims(String issuer, String audience, Instant issuedAt, Instant expiresAt, boolean required) {
        JwtClaimsSet.Builder builder = JwtClaimsSet.builder().issuer(issuer).audience(List.of(audience))
                .issuedAt(issuedAt).expiresAt(expiresAt).subject("user@example.test");
        if (required) builder.id("token-id").claim("role", "MANAGER");
        return builder.build();
    }

    private void assertRejected(org.springframework.security.oauth2.jwt.JwtEncoder encoder,
            org.springframework.security.oauth2.jwt.JwtDecoder decoder, JwtClaimsSet claims, MacAlgorithm algorithm) {
        String token = encoder.encode(JwtEncoderParameters.from(JwsHeader.with(algorithm).build(), claims)).getTokenValue();
        assertThatThrownBy(() -> decoder.decode(token)).isInstanceOf(JwtException.class);
    }
}
