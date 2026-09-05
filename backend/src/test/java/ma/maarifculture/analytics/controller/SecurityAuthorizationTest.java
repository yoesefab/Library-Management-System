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
import org.springframework.mock.web.MockHttpSession;
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

    @Test void createsHttpSessionAndEnforcesFinancialRole() throws Exception {
        MockHttpSession session=(MockHttpSession)mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"stock@test.local\",\"password\":\"StrongPassword123!\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.role").value("STOCK_EMPLOYEE"))
                .andReturn().getRequest().getSession(false);
        mockMvc.perform(get("/api/auth/me").session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.email").value("stock@test.local"));
        mockMvc.perform(get("/api/dashboard").param("start","2026-01-01T00:00:00Z").param("end","2026-12-31T23:59:59Z").session(session))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/admin/demo-data/catalog").with(csrf()).session(session))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/auth/logout").with(csrf()).session(session)).andExpect(status().isNoContent());
    }
}
