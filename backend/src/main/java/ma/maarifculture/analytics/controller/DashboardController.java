package ma.maarifculture.analytics.controller;

import java.time.Instant;
import ma.maarifculture.analytics.dto.DashboardDtos.DashboardResponse;
import ma.maarifculture.analytics.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/dashboard") @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
public class DashboardController {
    private final DashboardService service;public DashboardController(DashboardService service){this.service=service;}
    @GetMapping public DashboardResponse dashboard(@RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) Instant start,@RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) Instant end,@RequestParam(required=false) Long categoryId,@RequestParam(required=false) String language,@RequestParam(required=false) Long authorId,@RequestParam(required=false) Long publisherId){return service.dashboard(start,end,categoryId,language,authorId,publisherId);}
}
