package ma.maarifculture.analytics.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest(properties = {
        "maarif.jwt.secret=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
        "maarif.jwt.issuer=maarif-analytics-test",
        "maarif.jwt.audience=maarif-analytics-test-client"
})
@AutoConfigureMockMvc(addFilters = false)
@Transactional
@Rollback
@EnabledIfEnvironmentVariable(named = "MAARIF_EXTERNAL_POSTGRES_TEST", matches = "true")
@WithMockUser(roles = "MANAGER")
class ProductApiExternalPostgresIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createsSearchesAndSoftDeletesProductOnPostgres() throws Exception {
        long categoryId = createReference("/api/catalog/categories", "{\"name\":\"API Scolaire synthétique\"}");
        long authorId = createReference("/api/catalog/authors", "{\"name\":\"Auteur API synthétique\"}");
        long publisherId = createReference("/api/catalog/publishers", "{\"name\":\"Éditeur API synthétique\"}");
        long supplierId = createReference("/api/catalog/suppliers", """
                {
                  "name": "Fournisseur API synthétique",
                  "contactName": "Contact fictif",
                  "email": "demo@example.invalid",
                  "defaultLeadTimeDays": 8
                }
                """);

        MvcResult createResult = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(("""
                                {
                                  "sku": "PG-API-001",
                                  "isbn": "9780000000099",
                                  "title": "Catalogue PostgreSQL — Donnée synthétique",
                                  "description": "Produit créé uniquement par un test transactionnel.",
                                  "language": "fr",
                                  "sellingPrice": 149.90,
                                  "purchaseCost": 90.25,
                                  "minimumStockThreshold": 4,
                                  "supplierLeadTimeDays": 8,
                                  "categoryId": %d,
                                  "publisherId": %d,
                                  "supplierId": %d,
                                  "authorIds": [%d]
                                }
                                """).formatted(categoryId, publisherId, supplierId, authorId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku").value("PG-API-001"))
                .andExpect(jsonPath("$.category.name").value("API Scolaire synthétique"))
                .andExpect(jsonPath("$.authors[0].name").value("Auteur API synthétique"))
                .andReturn();

        JsonNode created = objectMapper.readTree(createResult.getResponse().getContentAsString());
        long productId = created.get("id").asLong();

        mockMvc.perform(get("/api/products")
                        .param("query", "PostgreSQL")
                        .param("active", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(productId))
                .andExpect(jsonPath("$.totalElements").value(1));

        mockMvc.perform(delete("/api/products/{id}", productId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    private long createReference(String path, String json) throws Exception {
        MvcResult result = mockMvc.perform(post(path)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }
}
