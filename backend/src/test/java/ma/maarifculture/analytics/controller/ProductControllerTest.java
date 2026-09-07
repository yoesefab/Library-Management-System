package ma.maarifculture.analytics.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.dto.ProductDetailResponse;
import ma.maarifculture.analytics.dto.ProductRequest;
import ma.maarifculture.analytics.dto.ProductSummaryResponse;
import ma.maarifculture.analytics.exception.GlobalExceptionHandler;
import ma.maarifculture.analytics.service.ProductService;
import ma.maarifculture.analytics.service.ProductImageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private ProductImageService productImageService;

    @Test
    void returnsPaginatedProducts() throws Exception {
        ProductSummaryResponse product = new ProductSummaryResponse(
                7L, "LIV-FR-007", null, "Produit synthétique", null, "fr", new BigDecimal("95.00"),
                "Littérature", "Éditions Démo", true);
        when(productService.search("livre", true, "fr", null, 0, 20))
                .thenReturn(new PageResponse<>(List.of(product), 0, 20, 1, 1, true, true));

        mockMvc.perform(get("/api/products")
                        .param("query", "livre")
                        .param("active", "true")
                        .param("language", "fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].sku").value("LIV-FR-007"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void createsProductAndReturnsLocation() throws Exception {
        ProductDetailResponse created = new ProductDetailResponse(
                12L,
                "LIV-AR-012",
                null,
                "كتاب تجريبي",
                null,
                null,
                "ar",
                new BigDecimal("70.00"),
                null,
                2,
                null,
                null,
                null,
                null,
                List.of(),
                true,
                Instant.parse("2026-08-27T00:00:00Z"),
                Instant.parse("2026-08-27T00:00:00Z"));
        when(productService.create(any(ProductRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sku": "LIV-AR-012",
                                  "title": "كتاب تجريبي",
                                  "language": "ar",
                                  "sellingPrice": 70.00,
                                  "minimumStockThreshold": 2,
                                  "authorIds": []
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/products/12"))
                .andExpect(jsonPath("$.language").value("ar"));
    }

    @Test
    void returnsStructuredValidationErrors() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sku": "",
                                  "title": "",
                                  "language": "french",
                                  "sellingPrice": -1,
                                  "minimumStockThreshold": -2,
                                  "authorIds": []
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.violations").isArray())
                .andExpect(jsonPath("$.path").value("/api/products"));
    }
}
