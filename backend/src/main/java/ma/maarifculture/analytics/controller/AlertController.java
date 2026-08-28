package ma.maarifculture.analytics.controller;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Map;
import ma.maarifculture.analytics.dto.InventoryDtos.AlertResponse;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.model.*;
import ma.maarifculture.analytics.service.AlertService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/alerts")
@PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','STOCK_EMPLOYEE')")
public class AlertController {
    private final AlertService service;public AlertController(AlertService service){this.service=service;}
    @GetMapping public PageResponse<AlertResponse> list(@RequestParam(required=false) AlertStatus status,@RequestParam(required=false) AlertType type,@RequestParam(defaultValue="0") @Min(0) int page,@RequestParam(defaultValue="20") @Min(1) @Max(100) int size){return service.list(status,type,page,size);}
    @PostMapping("/refresh") @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')") public Map<String,Integer> refresh(){return Map.of("created",service.refresh());}
    @PostMapping("/{id}/acknowledge") public AlertResponse acknowledge(@PathVariable Long id){return service.acknowledge(id);}
    @PostMapping("/{id}/resolve") public AlertResponse resolve(@PathVariable Long id){return service.resolve(id);}
}
