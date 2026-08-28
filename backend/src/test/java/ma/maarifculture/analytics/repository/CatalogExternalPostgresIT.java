package ma.maarifculture.analytics.repository;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import ma.maarifculture.analytics.model.Author;
import ma.maarifculture.analytics.model.Category;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.model.Publisher;
import ma.maarifculture.analytics.model.Supplier;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=validate")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@EnabledIfEnvironmentVariable(named = "MAARIF_EXTERNAL_POSTGRES_TEST", matches = "true")
class CatalogExternalPostgresIT {

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
    void persistsCatalogGraphOnConfiguredPostgres() {
        Category category = categoryRepository.save(new Category("Test PostgreSQL", null));
        Author author = authorRepository.save(new Author("Auteur PostgreSQL synthétique"));
        Publisher publisher = publisherRepository.save(new Publisher("Éditeur PostgreSQL synthétique"));
        Supplier supplier = supplierRepository.save(new Supplier("Fournisseur PostgreSQL synthétique", 8));

        Product product = new Product("PG-VERIFICATION-001", "Preuve PostgreSQL", "fr", new BigDecimal("99.00"));
        product.assignReferences(category, publisher, supplier);
        product.addAuthor(author);
        productRepository.saveAndFlush(product);
        entityManager.clear();

        Product reloaded = productRepository.findBySku("PG-VERIFICATION-001").orElseThrow();

        assertThat(reloaded.getCategory().getName()).isEqualTo("Test PostgreSQL");
        assertThat(reloaded.getAuthors()).extracting(Author::getName)
                .containsExactly("Auteur PostgreSQL synthétique");
    }
}
