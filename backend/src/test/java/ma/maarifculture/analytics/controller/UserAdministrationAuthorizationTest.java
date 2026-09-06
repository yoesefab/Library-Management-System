package ma.maarifculture.analytics.controller;

import ma.maarifculture.analytics.dto.AuthDtos.UserResponse;
import ma.maarifculture.analytics.model.UserRole;
import ma.maarifculture.analytics.service.UserAdministrationService;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdministrationController.class)
@Import(UserAdministrationAuthorizationTest.MethodSecurity.class)
class UserAdministrationAuthorizationTest {
    @TestConfiguration
    @EnableMethodSecurity
    static class MethodSecurity {}

    @Autowired MockMvc mvc;
    @MockitoBean UserAdministrationService service;

    private static final String REQUEST = """
        {"fullName":"Compte Démo","email":"demo@example.test","password":"SyntheticTest123!","role":"MANAGER","active":false}
        """;

    @ParameterizedTest
    @ValueSource(strings = {"MANAGER", "STOCK_EMPLOYEE"})
    void nonAdministratorsCannotManageUsers(String role) throws Exception {
        mvc.perform(get("/api/admin/users").with(user("test").roles(role))).andExpect(status().isForbidden());
        mvc.perform(post("/api/admin/users").with(user("test").roles(role)).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content(REQUEST)).andExpect(status().isForbidden());
        mvc.perform(put("/api/admin/users/1").with(user("test").roles(role)).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content(REQUEST)).andExpect(status().isForbidden());
        verifyNoInteractions(service);
    }

    @ParameterizedTest
    @ValueSource(strings = {"ADMINISTRATOR"})
    void administratorCanManageUsers(String role) throws Exception {
        var response = new UserResponse(1L, "Compte Démo", "demo@example.test", UserRole.MANAGER, false);
        when(service.create(any())).thenReturn(response);
        when(service.update(eq(1L), any())).thenReturn(response);
        mvc.perform(get("/api/admin/users").with(user("test").roles(role))).andExpect(status().isOk());
        mvc.perform(post("/api/admin/users").with(user("test").roles(role)).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content(REQUEST)).andExpect(status().isCreated());
        mvc.perform(put("/api/admin/users/1").with(user("test").roles(role)).with(csrf())
                .contentType(MediaType.APPLICATION_JSON).content(REQUEST)).andExpect(status().isOk());
        verify(service).list("", 0, 20, null, null, "fullName", "asc");
        verify(service).create(any());
        verify(service).update(eq(1L), any());
    }
    @org.junit.jupiter.api.Test
    void forwardsCombinedFiltersAndPagination() throws Exception {
        mvc.perform(get("/api/admin/users").with(user("test").roles("ADMINISTRATOR"))
                .param("query", "Démo").param("role", "MANAGER").param("active", "false")
                .param("page", "1").param("size", "10").param("sortBy", "email").param("direction", "desc"))
                .andExpect(status().isOk());
        verify(service).list("Démo", 1, 10, UserRole.MANAGER, false, "email", "desc");
    }

}
