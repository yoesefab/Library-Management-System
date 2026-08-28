package ma.maarifculture.analytics.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import ma.maarifculture.analytics.dto.InventoryDtos.MovementRequest;
import ma.maarifculture.analytics.model.*;
import ma.maarifculture.analytics.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class BackendWorkflowTest {
    @Autowired AppUserRepository users;
    @Autowired ProductRepository products;
    @Autowired InventoryService inventory;
    @Autowired CsvImportService imports;
    @Autowired ForecastService forecasts;
    @Autowired DashboardService dashboard;
    @Autowired AlertService alerts;
    @Autowired ReportService reports;

    Product product;

    @BeforeEach void setup(){
        AppUser admin=users.save(new AppUser("Admin workflow","workflow@test.local","unused",UserRole.ADMINISTRATOR));
        SecurityContextHolder.getContext().setAuthentication(UsernamePasswordAuthenticationToken.authenticated(
                admin.getEmail(),"",List.of(new SimpleGrantedAuthority("ROLE_ADMINISTRATOR"))));
        product=new Product("FLOW-001","Livre workflow synthétique","fr",new BigDecimal("100.00"));
        product.configureInventory(9,7);product=products.save(product);
        inventory.record(new MovementRequest(product.getId(),InventoryMovementType.INITIAL_STOCK,10,"Stock initial synthétique"));
    }

    @Test void importsSaleOnceAndUpdatesAnalyticsForecastAlertsAndReports() throws Exception {
        String csv="order_reference,order_date,product_sku,quantity,unit_price,discount,customer_city,order_status\n"
                +"FLOW-ORDER-1,2026-08-20T10:00:00Z,FLOW-001,2,100.00,0.00,Casablanca,COMPLETED\n";
        MockMultipartFile file=new MockMultipartFile("file","sales.csv","text/csv",csv.getBytes(StandardCharsets.UTF_8));
        var preview=imports.preview(file);assertThat(preview.failedRows()).isZero();
        imports.confirm(preview.id());imports.confirm(preview.id());
        assertThat(inventory.currentStock(product.getId())).isEqualTo(8);
        var duplicate=imports.preview(file);assertThat(duplicate.id()).isEqualTo(preview.id());
        var kpis=dashboard.dashboard(Instant.parse("2026-08-01T00:00:00Z"),Instant.parse("2026-08-31T23:59:59Z"),null,null,null,null);
        assertThat(kpis.totalRevenue()).isEqualByComparingTo("200.00");assertThat(kpis.unitsSold()).isEqualTo(2);
        assertThat(alerts.refresh()).isGreaterThanOrEqualTo(1);
        assertThat(forecasts.generate(product.getId()).method()).isEqualTo(ForecastMethod.FALLBACK);
        assertThat(forecasts.recommend(product.getId()).explanation()).contains("Aucune commande fournisseur");
        assertThat(reports.inventoryCsv(false)).contains("FLOW-001");
        assertThat(reports.managementPdf(Instant.parse("2026-08-01T00:00:00Z"),Instant.parse("2026-08-31T23:59:59Z"),null,null,null,null)).isNotEmpty();
    }
}
