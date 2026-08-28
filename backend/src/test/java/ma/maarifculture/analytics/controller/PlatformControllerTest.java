package ma.maarifculture.analytics.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PlatformController.class)
@AutoConfigureMockMvc(addFilters = false)
class PlatformControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsNonSensitiveFoundationMetadata() throws Exception {
        mockMvc.perform(get("/api/platform"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Maarif Analytics"))
                .andExpect(jsonPath("$.status").value("BACKEND_READY"))
                .andExpect(jsonPath("$.databaseSchema").value("V2"))
                .andExpect(jsonPath("$.businessTimezone").value("Africa/Casablanca"));
    }
}
