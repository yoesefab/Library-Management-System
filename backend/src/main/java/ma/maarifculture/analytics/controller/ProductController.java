package ma.maarifculture.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.net.URI;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.dto.ProductDetailResponse;
import ma.maarifculture.analytics.dto.ProductRequest;
import ma.maarifculture.analytics.dto.ProductSummaryResponse;
import ma.maarifculture.analytics.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@Validated
@PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','STOCK_EMPLOYEE')")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Lister et filtrer les produits")
    public PageResponse<ProductSummaryResponse> search(
            @RequestParam(defaultValue = "") @Size(max = 300) String query,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) @Size(max = 10) String language,
            @RequestParam(required = false) @Positive Long categoryId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return productService.search(query, active, language, categoryId, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulter un produit")
    public ProductDetailResponse findById(@PathVariable @Positive Long id) {
        return productService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @Operation(summary = "Créer un produit")
    public ResponseEntity<ProductDetailResponse> create(@Valid @RequestBody ProductRequest request) {
        ProductDetailResponse created = productService.create(request);
        return ResponseEntity.created(URI.create("/api/products/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @Operation(summary = "Modifier un produit")
    public ProductDetailResponse update(
            @PathVariable @Positive Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @Operation(summary = "Désactiver un produit sans supprimer son historique")
    public ResponseEntity<Void> deactivate(@PathVariable @Positive Long id) {
        productService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
