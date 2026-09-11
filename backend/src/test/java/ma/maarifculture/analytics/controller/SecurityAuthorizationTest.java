package ma.maarifculture.analytics.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.model.UserRole;
import ma.maarifculture.analytics.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import jakarta.servlet.http.Cookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = "maarif.demo-data.enabled=true")
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class SecurityAuthorizationTest {
    @Autowired MockMvc mockMvc;
    @Autowired AppUserRepository users;
    @Autowired PasswordEncoder encoder;

    @BeforeEach void user(){users.save(new AppUser("Employé stock","stock@test.local",encoder.encode("StrongPassword123!"),UserRole.STOCK_EMPLOYEE));}

    @Test void rejectsAnonymousCatalogueAccess() throws Exception {
        mockMvc.perform(get("/api/products")).andExpect(status().isUnauthorized());
    }

    @Test void allowsTheLocalPrototypeOrigin() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                        .header("Origin", "http://127.0.0.1:5174")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://127.0.0.1:5174"));
    }

    @Test void createsJwtCookieAndEnforcesFinancialRole() throws Exception {
        Cookie accessToken=mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"stock@test.local\",\"password\":\"StrongPassword123!\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.role").value("STOCK_EMPLOYEE"))
                .andReturn().getResponse().getCookie("ACCESS_TOKEN");
        org.assertj.core.api.Assertions.assertThat(accessToken).isNotNull();
        org.assertj.core.api.Assertions.assertThat(accessToken.isHttpOnly()).isTrue();
        org.assertj.core.api.Assertions.assertThat(accessToken.getValue().split("\\.")).hasSize(3);
        mockMvc.perform(get("/api/auth/me").cookie(accessToken)).andExpect(status().isOk()).andExpect(jsonPath("$.email").value("stock@test.local"));
        mockMvc.perform(get("/api/dashboard").param("start","2026-01-01T00:00:00Z").param("end","2026-12-31T23:59:59Z").cookie(accessToken))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/products").cookie(accessToken)).andExpect(status().isOk());
        mockMvc.perform(get("/api/inventory").cookie(accessToken)).andExpect(status().isOk());
        mockMvc.perform(get("/api/alerts").cookie(accessToken)).andExpect(status().isOk());
        mockMvc.perform(post("/api/products").with(csrf()).cookie(accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"sku":"SECURITY-TEST","isbn":"","title":"Test synthétique","description":"","language":"fr","sellingPrice":10.00,"purchaseCost":null,"minimumStockThreshold":0,"supplierLeadTimeDays":null,"categoryId":null,"publisherId":null,"supplierId":null,"authorIds":[]}
                                """))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/orders").cookie(accessToken)).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/imports").cookie(accessToken)).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/forecasting/recommendations").cookie(accessToken)).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/reports/inventory.csv").cookie(accessToken)).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/settings").cookie(accessToken)).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/users").cookie(accessToken)).andExpect(status().isForbidden());
        mockMvc.perform(post("/api/admin/demo-data/catalog").with(csrf()).cookie(accessToken))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/auth/logout").with(csrf()).cookie(accessToken))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge("ACCESS_TOKEN", 0));
    }

    @Test void rejectsATamperedJwtSignature() throws Exception {
        Cookie accessToken=mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"stock@test.local\",\"password\":\"StrongPassword123!\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getCookie("ACCESS_TOKEN");
        org.assertj.core.api.Assertions.assertThat(accessToken).isNotNull();
        String value=accessToken.getValue();
        accessToken.setValue(value.substring(0,value.length()-1)+(value.endsWith("a")?"b":"a"));
        mockMvc.perform(get("/api/auth/me").cookie(accessToken)).andExpect(status().isUnauthorized());
    }
}
