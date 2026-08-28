package ma.maarifculture.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.net.URI;
import ma.maarifculture.analytics.dto.CategoryRequest;
import ma.maarifculture.analytics.dto.CategoryResponse;
import ma.maarifculture.analytics.dto.NamedReferenceRequest;
import ma.maarifculture.analytics.dto.NamedReferenceResponse;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.dto.SupplierRequest;
import ma.maarifculture.analytics.dto.SupplierResponse;
import ma.maarifculture.analytics.service.CatalogReferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalog")
@Validated
@PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','STOCK_EMPLOYEE')")
public class CatalogReferenceController {

    private final CatalogReferenceService referenceService;

    public CatalogReferenceController(CatalogReferenceService referenceService) {
        this.referenceService = referenceService;
    }

    @GetMapping("/categories")
    @Operation(summary = "Lister les catégories")
    public PageResponse<CategoryResponse> categories(
            @RequestParam(defaultValue = "") @Size(max = 180) String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return referenceService.categories(query, page, size);
    }

    @PostMapping("/categories")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @Operation(summary = "Créer une catégorie")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse created = referenceService.createCategory(request);
        return ResponseEntity.created(URI.create("/api/catalog/categories/" + created.id())).body(created);
    }

    @GetMapping("/authors")
    @Operation(summary = "Lister les auteurs")
    public PageResponse<NamedReferenceResponse> authors(
            @RequestParam(defaultValue = "") @Size(max = 180) String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return referenceService.authors(query, page, size);
    }

    @PostMapping("/authors")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @Operation(summary = "Créer un auteur")
    public ResponseEntity<NamedReferenceResponse> createAuthor(@Valid @RequestBody NamedReferenceRequest request) {
        NamedReferenceResponse created = referenceService.createAuthor(request);
        return ResponseEntity.created(URI.create("/api/catalog/authors/" + created.id())).body(created);
    }

    @GetMapping("/publishers")
    @Operation(summary = "Lister les éditeurs")
    public PageResponse<NamedReferenceResponse> publishers(
            @RequestParam(defaultValue = "") @Size(max = 180) String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return referenceService.publishers(query, page, size);
    }

    @PostMapping("/publishers")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @Operation(summary = "Créer un éditeur")
    public ResponseEntity<NamedReferenceResponse> createPublisher(@Valid @RequestBody NamedReferenceRequest request) {
        NamedReferenceResponse created = referenceService.createPublisher(request);
        return ResponseEntity.created(URI.create("/api/catalog/publishers/" + created.id())).body(created);
    }

    @GetMapping("/suppliers")
    @Operation(summary = "Lister les fournisseurs")
    public PageResponse<SupplierResponse> suppliers(
            @RequestParam(defaultValue = "") @Size(max = 180) String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return referenceService.suppliers(query, page, size);
    }

    @PostMapping("/suppliers")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @Operation(summary = "Créer un fournisseur")
    public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierRequest request) {
        SupplierResponse created = referenceService.createSupplier(request);
        return ResponseEntity.created(URI.create("/api/catalog/suppliers/" + created.id())).body(created);
    }
}
