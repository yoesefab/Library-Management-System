package ma.maarifculture.analytics.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ma.maarifculture.analytics.dto.NamedReferenceRequest;
import ma.maarifculture.analytics.dto.NamedReferenceResponse;
import ma.maarifculture.analytics.exception.GlobalExceptionHandler;
import ma.maarifculture.analytics.service.CatalogReferenceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CatalogReferenceController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class CatalogReferenceControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private CatalogReferenceService referenceService;

    @Test
    void createsAuthor() throws Exception {
        when(referenceService.createAuthor(any(NamedReferenceRequest.class)))
                .thenReturn(new NamedReferenceResponse(15L, "Fatima Zahra — Démo"));

        mockMvc.perform(post("/api/catalog/authors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Fatima Zahra — Démo\"}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/catalog/authors/15"))
                .andExpect(jsonPath("$.name").value("Fatima Zahra — Démo"));
    }

    @Test
    void rejectsInvalidSupplierContact() throws Exception {
        mockMvc.perform(post("/api/catalog/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Distribution Démo",
                                  "email": "adresse-invalide",
                                  "defaultLeadTimeDays": -1
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.violations").isArray());
    }
}
