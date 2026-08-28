package ma.maarifculture.analytics.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.model.UserRole;
import ma.maarifculture.analytics.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = "maarif.demo-data.enabled=true")
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BackendEndToEndApiTest {

    private static final String ADMIN_EMAIL = "e2e-admin@test.local";
    private static final String ADMIN_PASSWORD = "StrongPassword123!";

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired AppUserRepository users;
    @Autowired PasswordEncoder passwordEncoder;

    @BeforeEach
    void createAdministrator() {
        users.save(new AppUser(
                "Administrateur E2E",
                ADMIN_EMAIL,
                passwordEncoder.encode(ADMIN_PASSWORD),
                UserRole.ADMINISTRATOR));
    }

    @Test
    void executesTheCompleteSyntheticDemonstrationThroughHttp() throws Exception {
        MockHttpSession session = login();

        mockMvc.perform(post("/api/admin/demo-data/catalog").session(session).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.synthetic").value(true))
                .andExpect(jsonPath("$.productsCreated").value(15))
                .andExpect(jsonPath("$.initialMovementsCreated").value(15));

        mockMvc.perform(post("/api/admin/demo-data/catalog").session(session).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productsCreated").value(0))
                .andExpect(jsonPath("$.productsAlreadyPresent").value(15))
                .andExpect(jsonPath("$.initialMovementsCreated").value(0));

        long bestsellerId = productId(session, "LIV-FR-001");
        long outOfStockId = productId(session, "LIV-AR-004");
        long insufficientHistoryId = productId(session, "NEW-EN-015");
        assertThat(currentStock(session, "LIV-AR-004")).isEqualTo(26);

        JsonNode invalidPreview = preview(session, "sales-invalid.csv");
        assertThat(invalidPreview.path("status").asText()).isEqualTo("PARTIAL");
        assertThat(invalidPreview.path("failedRows").asInt()).isGreaterThanOrEqualTo(8);
        mockMvc.perform(get("/api/imports/{id}/errors.csv", invalidPreview.path("id").asLong()).session(session))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("UNKNOWN_SKU")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("INCONSISTENT_ORDER")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("DUPLICATE_ORDER_PRODUCT")));

        JsonNode validPreview = preview(session, "sales-valid.csv");
        long importId = validPreview.path("id").asLong();
        assertThat(validPreview.path("status").asText()).isEqualTo("READY");
        assertThat(validPreview.path("totalRows").asInt()).isEqualTo(280);
        assertThat(validPreview.path("failedRows").asInt()).isZero();

        mockMvc.perform(post("/api/imports/{id}/confirm", importId).session(session).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.successfulRows").value(280));

        assertThat(currentStock(session, "LIV-AR-004")).isZero();

        mockMvc.perform(post("/api/imports/{id}/confirm", importId).session(session).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
        assertThat(currentStock(session, "LIV-AR-004")).isZero();

        JsonNode duplicatePreview = preview(session, "sales-valid.csv");
        assertThat(duplicatePreview.path("id").asLong()).isEqualTo(importId);

        mockMvc.perform(get("/api/dashboard")
                        .param("start", "2025-09-01T00:00:00Z")
                        .param("end", "2026-08-27T23:59:59Z")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numberOfOrders").value(52))
                .andExpect(jsonPath("$.unitsSold").value(585))
                .andExpect(jsonPath("$.totalRevenue", greaterThan(0.0)))
                .andExpect(jsonPath("$.bestsellingProducts[0].sku").value("LIV-FR-001"));

        mockMvc.perform(post("/api/alerts/refresh").session(session).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.created", greaterThan(0)));
        mockMvc.perform(get("/api/alerts")
                        .param("status", "OPEN")
                        .param("type", "OUT_OF_STOCK")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].sku").value("LIV-AR-004"));

        mockMvc.perform(post("/api/forecasting/products/{id}/generate", bestsellerId)
                        .session(session)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.method", not("FALLBACK")))
                .andExpect(jsonPath("$.accuracyMetric").value("MAE"));
        mockMvc.perform(post("/api/forecasting/products/{id}/generate", insufficientHistoryId)
                        .session(session)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.method").value("FALLBACK"));
        mockMvc.perform(post("/api/forecasting/products/{id}/recommend", outOfStockId)
                        .session(session)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentStock").value(0))
                .andExpect(jsonPath("$.recommendedQuantity", greaterThan(0)))
                .andExpect(jsonPath("$.explanation", org.hamcrest.Matchers.containsString("Aucune commande fournisseur")));

        mockMvc.perform(get("/api/reports/inventory.csv").session(session))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=inventory.csv"))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("LIV-AR-004")));
        MvcResult pdf = mockMvc.perform(get("/api/reports/management.pdf")
                        .param("start", "2025-09-01T00:00:00Z")
                        .param("end", "2026-08-27T23:59:59Z")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andReturn();
        assertThat(new String(pdf.getResponse().getContentAsByteArray(), 0, 4, StandardCharsets.US_ASCII))
                .isEqualTo("%PDF");
    }

    private MockHttpSession login() throws Exception {
        return (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(ADMIN_EMAIL, ADMIN_PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMINISTRATOR"))
                .andReturn()
                .getRequest()
                .getSession(false);
    }

    private JsonNode preview(MockHttpSession session, String fileName) throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                fileName,
                "text/csv",
                Files.readAllBytes(sampleFile(fileName)));
        MvcResult result = mockMvc.perform(multipart("/api/imports/sales/preview")
                        .file(file)
                        .session(session)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsByteArray());
    }

    private long productId(MockHttpSession session, String sku) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/products")
                        .param("query", sku)
                        .param("size", "100")
                        .session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsByteArray())
                .path("content").path(0).path("id").asLong();
    }

    private int currentStock(MockHttpSession session, String sku) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/inventory")
                        .param("size", "100")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn();
        for (JsonNode row : objectMapper.readTree(result.getResponse().getContentAsByteArray()).path("content")) {
            if (sku.equals(row.path("sku").asText())) {
                return row.path("currentStock").asInt();
            }
        }
        throw new AssertionError("Produit absent de l'inventaire : " + sku);
    }

    private Path sampleFile(String name) {
        Path workingDirectory = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        for (Path directory : new Path[] {
                workingDirectory.resolve("sample-data"),
                workingDirectory.resolve("../sample-data").normalize()
        }) {
            Path candidate = directory.resolve(name);
            if (Files.isRegularFile(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Fichier de démonstration introuvable : " + name);
    }
}
