package ma.maarifculture.analytics.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import ma.maarifculture.analytics.model.Author;
import ma.maarifculture.analytics.model.Category;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.model.Publisher;
import ma.maarifculture.analytics.model.Supplier;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=validate")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers(disabledWithoutDocker = true)
class CatalogPersistenceIT {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("maarif_catalog_test")
            .withUsername("maarif_test")
            .withPassword("maarif_test");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private PublisherRepository publisherRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void flywaySchemaPersistsAndReadsCompleteCatalogGraph() {
        Category category = categoryRepository.save(new Category("Informatique", null));
        Author author = authorRepository.save(new Author("Robert C. Martin — synthétique"));
        Publisher publisher = publisherRepository.save(new Publisher("Éditions Démo"));
        Supplier supplier = supplierRepository.save(new Supplier("Distribution Atlas Démo", 10));

        Product product = new Product("LIV-EN-001", "Clean Architecture — Démo", "en", new BigDecimal("249.00"));
        product.setIsbn("9780000000001");
        product.setPurchaseCost(new BigDecimal("151.25"));
        product.configureInventory(4, 12);
        product.assignReferences(category, publisher, supplier);
        product.addAuthor(author);
        productRepository.saveAndFlush(product);
        entityManager.clear();

        Product reloaded = productRepository.findBySku("LIV-EN-001").orElseThrow();

        assertThat(reloaded.getTitle()).isEqualTo("Clean Architecture — Démo");
        assertThat(reloaded.getCategory().getName()).isEqualTo("Informatique");
        assertThat(reloaded.getPublisher().getName()).isEqualTo("Éditions Démo");
        assertThat(reloaded.getSupplier().getDefaultLeadTimeDays()).isEqualTo(10);
        assertThat(reloaded.getAuthors()).extracting(Author::getName)
                .containsExactly("Robert C. Martin — synthétique");
        assertThat(reloaded.getCreatedAt()).isNotNull();

        assertThat(productRepository.search(
                        "architecture", true, null, null, PageRequest.of(0, 20)))
                .hasSize(1);
    }

    @Test
    void databaseRejectsDuplicateSku() {
        productRepository.saveAndFlush(new Product("DUPLICATE-SKU", "Premier", "fr", new BigDecimal("50.00")));

        assertThatThrownBy(() -> productRepository.saveAndFlush(
                        new Product("DUPLICATE-SKU", "Second", "fr", new BigDecimal("60.00"))))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
    @Autowired private AppUserRepository userRepository;

    @Test
    void filtersUsersBeforeCountingSortingAndPagination() {
        var first = new ma.maarifculture.analytics.model.AppUser("B Compte Démo", "b@example.test", "test-hash", ma.maarifculture.analytics.model.UserRole.MANAGER);
        var second = new ma.maarifculture.analytics.model.AppUser("C Compte Démo", "c@example.test", "test-hash", ma.maarifculture.analytics.model.UserRole.MANAGER);
        var active = new ma.maarifculture.analytics.model.AppUser("D Compte Démo", "d@example.test", "test-hash", ma.maarifculture.analytics.model.UserRole.MANAGER);
        var stock = new ma.maarifculture.analytics.model.AppUser("A Compte Démo", "a@example.test", "test-hash", ma.maarifculture.analytics.model.UserRole.STOCK_EMPLOYEE);
        first.setActive(false);
        second.setActive(false);
        stock.setActive(false);
        userRepository.saveAllAndFlush(java.util.List.of(first, second, active, stock));
        var sort = org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "fullName");
        var page = userRepository.search("COMPTE", ma.maarifculture.analytics.model.UserRole.MANAGER, false, PageRequest.of(0, 1, sort));
        assertThat(page.getTotalElements()).isEqualTo(2);
        assertThat(page.getContent()).extracting(ma.maarifculture.analytics.model.AppUser::getEmail).containsExactly("c@example.test");
        assertThat(userRepository.search("COMPTE", ma.maarifculture.analytics.model.UserRole.MANAGER, false, PageRequest.of(1, 1, sort)).getContent())
                .extracting(ma.maarifculture.analytics.model.AppUser::getEmail).containsExactly("b@example.test");
        assertThat(userRepository.search("d@example", null, true, PageRequest.of(0, 20)).getTotalElements()).isEqualTo(1);
        assertThat(userRepository.search("", null, null, PageRequest.of(0, 20)).getTotalElements()).isEqualTo(4);
    }

}
