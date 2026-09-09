package ma.maarifculture.analytics.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class RequestSecurityFilterTest {
    private final RequestSecurityFilter filter = new RequestSecurityFilter(
            2, 1, 1, Clock.fixed(Instant.parse("2026-09-09T12:00:00Z"), ZoneOffset.UTC));

    @Test
    void limitsLoginByRemoteAddressWithoutReflectingCredentials() throws Exception {
        assertThat(login().getStatus()).isEqualTo(200);
        assertThat(login().getStatus()).isEqualTo(200);

        MockHttpServletResponse rejected = login();

        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getHeader("Retry-After")).isEqualTo("60");
        assertThat(rejected.getContentAsString()).contains("RATE_LIMIT_EXCEEDED").doesNotContain("password");
    }

    @Test
    void replacesUntrustedRequestIdAndKeepsValidRequestId() throws Exception {
        MockHttpServletRequest unsafe = request("POST", "/api/imports/sales/preview");
        unsafe.addHeader("X-Request-ID", "bad header");
        MockHttpServletResponse first = run(unsafe);
        assertThat(first.getHeader("X-Request-ID")).matches("[0-9a-f-]{36}");

        MockHttpServletRequest safe = request("GET", "/api/products");
        safe.addHeader("X-Request-ID", "request-12345678");
        assertThat(run(safe).getHeader("X-Request-ID")).isEqualTo("request-12345678");
    }

    private MockHttpServletResponse login() throws Exception {
        return run(request("POST", "/api/auth/login"));
    }

    private MockHttpServletRequest request(String method, String path) {
        MockHttpServletRequest request = new MockHttpServletRequest(method, path);
        request.setRemoteAddr("192.0.2.10");
        return request;
    }

    private MockHttpServletResponse run(MockHttpServletRequest request) throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }
}
