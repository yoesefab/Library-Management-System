package ma.maarifculture.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import ma.maarifculture.analytics.dto.DemoDataDtos.CatalogLoadResponse;
import ma.maarifculture.analytics.service.DemoDataService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/demo-data")
@PreAuthorize("hasRole('ADMINISTRATOR')")
@ConditionalOnProperty(name = "maarif.demo-data.enabled", havingValue = "true")
public class DemoDataController {

    private final DemoDataService demoDataService;

    public DemoDataController(DemoDataService demoDataService) {
        this.demoDataService = demoDataService;
    }

    @PostMapping("/catalog")
    @Operation(summary = "Charger le catalogue et les stocks initiaux synthétiques")
    public CatalogLoadResponse loadCatalog() {
        return demoDataService.loadCatalog();
    }
}
