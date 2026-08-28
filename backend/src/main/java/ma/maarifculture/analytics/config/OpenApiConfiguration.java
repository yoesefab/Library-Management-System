package ma.maarifculture.analytics.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfiguration {

    @Bean
    OpenAPI maarifAnalyticsOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Maarif Analytics API")
                .version("0.1.0")
                .description("API de suivi des ventes et de gestion prédictive des stocks."));
    }
}
