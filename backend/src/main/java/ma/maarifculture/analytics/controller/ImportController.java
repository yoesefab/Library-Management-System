package ma.maarifculture.analytics.controller;

import java.io.IOException;
import ma.maarifculture.analytics.dto.ImportDtos.Preview;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.service.CsvImportService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController @RequestMapping("/api/imports") @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
public class ImportController {
    private final CsvImportService service;public ImportController(CsvImportService service){this.service=service;}
    @PostMapping(value="/sales/preview",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public Preview preview(@RequestPart("file") MultipartFile file)throws IOException{return service.preview(file);}
    @GetMapping public PageResponse<Preview> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){return service.list(page,size);}
    @PostMapping("/{id}/confirm") public Preview confirm(@PathVariable Long id)throws IOException{return service.confirm(id);}
    @GetMapping("/{id}") public Preview get(@PathVariable Long id){return service.get(id);}
    @GetMapping(value="/{id}/errors.csv",produces="text/csv") public ResponseEntity<String> errors(@PathVariable Long id){return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=import-errors-"+id+".csv").body(service.errorCsv(id));}
}
