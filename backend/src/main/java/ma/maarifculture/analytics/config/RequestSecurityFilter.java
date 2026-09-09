package ma.maarifculture.analytics.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Adds traceability and a conservative, per-instance abuse-control boundary. */
@Component
public class RequestSecurityFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(RequestSecurityFilter.class);
    private static final String REQUEST_ID = "X-Request-ID";
    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private final Clock clock;
    private final int loginLimit;
    private final int uploadLimit;
    private final int expensiveLimit;

    public RequestSecurityFilter(
            @Value("${maarif.rate-limit.login-per-minute:10}") int loginLimit,
            @Value("${maarif.rate-limit.upload-per-minute:20}") int uploadLimit,
            @Value("${maarif.rate-limit.expensive-per-minute:30}") int expensiveLimit) {
        this(loginLimit, uploadLimit, expensiveLimit, Clock.systemUTC());
    }

    RequestSecurityFilter(int loginLimit, int uploadLimit, int expensiveLimit, Clock clock) {
        this.loginLimit = positive(loginLimit);
        this.uploadLimit = positive(uploadLimit);
        this.expensiveLimit = positive(expensiveLimit);
        this.clock = clock;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestId = validRequestId(request.getHeader(REQUEST_ID));
        response.setHeader(REQUEST_ID, requestId);
        request.setAttribute(REQUEST_ID, requestId);

        Limit limit = limitFor(request);
        if (limit != null && !consume(clientKey(request) + ':' + limit.name(), limit.maximum())) {
            response.setStatus(429);
            response.setHeader("Retry-After", "60");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().write("{\"status\":429,\"code\":\"RATE_LIMIT_EXCEEDED\","
                    + "\"message\":\"Trop de requêtes. Réessayez dans une minute.\"}");
            LOGGER.warn("security_event=rate_limit_exceeded request_id={} route={} client={}",
                    requestId, request.getRequestURI(), Integer.toHexString(clientKey(request).hashCode()));
            return;
        }
        chain.doFilter(request, response);
    }

    private Limit limitFor(HttpServletRequest request) {
        String path = request.getRequestURI();
        if ("POST".equals(request.getMethod()) && "/api/auth/login".equals(path)) return new Limit("login", loginLimit);
        if (("POST".equals(request.getMethod()) || "PUT".equals(request.getMethod()))
                && (path.contains("/imports/") || path.endsWith("/image"))) return new Limit("upload", uploadLimit);
        if (path.startsWith("/api/reports") || path.contains("/generate") || path.contains("/recommend")
                || path.endsWith("/refresh")) return new Limit("expensive", expensiveLimit);
        return null;
    }

    private synchronized boolean consume(String key, int maximum) {
        long minute = clock.millis() / 60_000;
        Window window = windows.compute(key, (ignored, previous) ->
                previous == null || previous.minute() != minute ? new Window(minute, 1) : previous.increment());
        if (windows.size() > 10_000) windows.entrySet().removeIf(entry -> entry.getValue().minute() < minute - 1);
        return window.count() <= maximum;
    }

    private String clientKey(HttpServletRequest request) {
        // Do not trust forwarding headers here: the application must receive a proxy-normalized remote address.
        return request.getRemoteAddr() == null ? "unknown" : request.getRemoteAddr();
    }

    private static String validRequestId(String candidate) {
        if (candidate != null && candidate.matches("[A-Za-z0-9._-]{8,64}")) return candidate;
        return UUID.randomUUID().toString();
    }

    private static int positive(int value) {
        if (value < 1) throw new IllegalArgumentException("Une limite de débit doit être strictement positive.");
        return value;
    }

    private record Limit(String name, int maximum) {}
    private record Window(long minute, int count) { Window increment() { return new Window(minute, count + 1); } }
}
