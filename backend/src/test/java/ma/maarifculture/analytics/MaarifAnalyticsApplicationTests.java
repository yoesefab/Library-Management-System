package ma.maarifculture.analytics;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
class MaarifAnalyticsApplicationTests {

    @Test
    void contextLoadsWithFlywaySchema() {
        // Le démarrage du contexte vérifie la configuration et la migration V1.
    }
}

