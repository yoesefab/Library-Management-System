package ma.maarifculture.analytics.controller;

import java.time.Instant;
import ma.maarifculture.analytics.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/reports") @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
public class ReportController {
    private final ReportService service;public ReportController(ReportService service){this.service=service;}
    @GetMapping(value="/inventory.csv",produces="text/csv") public ResponseEntity<String> inventory(){return csv("inventory.csv",service.inventoryCsv(false));}
    @GetMapping(value="/low-stock.csv",produces="text/csv") public ResponseEntity<String> lowStock(){return csv("low-stock.csv",service.inventoryCsv(true));}
    @GetMapping(value="/reorder-recommendations.csv",produces="text/csv") public ResponseEntity<String> reorder(){return csv("reorder-recommendations.csv",service.recommendationsCsv());}
    @GetMapping(value="/management.pdf",produces=MediaType.APPLICATION_PDF_VALUE) public ResponseEntity<byte[]> pdf(@RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) Instant start,@RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME) Instant end,@RequestParam(required=false) Long categoryId,@RequestParam(required=false) String language,@RequestParam(required=false) Long authorId,@RequestParam(required=false) Long publisherId){return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=rapport-gestion.pdf").body(service.managementPdf(start,end,categoryId,language,authorId,publisherId));}
    private ResponseEntity<String> csv(String name,String body){return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename="+name).body(body);}
}
