package ma.maarifculture.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import java.time.ZoneId;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/platform")
public class PlatformController {

    private final String businessTimezone;

    public PlatformController(
            @Value("${maarif.business-timezone:Africa/Casablanca}") String businessTimezone) {
        ZoneId.of(businessTimezone);
        this.businessTimezone = businessTimezone;
    }

    @GetMapping
    @Operation(summary = "Expose les métadonnées non sensibles du backend")
    public Map<String, String> platform() {
        return Map.of(
                "name", "Maarif Analytics",
                "status", "BACKEND_READY",
                "databaseSchema", "V2",
                "businessTimezone", businessTimezone);
    }
}
