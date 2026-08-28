package ma.maarifculture.analytics.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class ProductTest {

    @Test
    void createsProductWithNormalizedCoreValues() {
        Product product = new Product(" LIV-FR-001 ", " Clean Code ", "FR", new BigDecimal("129.00"));

        assertThat(product.getSku()).isEqualTo("LIV-FR-001");
        assertThat(product.getTitle()).isEqualTo("Clean Code");
        assertThat(product.getLanguage()).isEqualTo("fr");
        assertThat(product.isActive()).isTrue();
    }

    @Test
    void rejectsInvalidMoneyAndInventoryValues() {
        assertThatThrownBy(() -> new Product("SKU", "Titre", "fr", new BigDecimal("1.999")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at most 2 decimals");

        Product product = new Product("SKU", "Titre", "fr", new BigDecimal("10.00"));

        assertThatThrownBy(() -> product.configureInventory(-1, 7))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("must not be negative");
    }

    @Test
    void keepsAuthorsCollectionReadOnlyForCallers() {
        Product product = new Product("SKU", "Titre", "ar", new BigDecimal("85.00"));
        Author author = new Author("Auteur synthétique");
        product.addAuthor(author);

        assertThat(product.getAuthors()).containsExactly(author);
        assertThatThrownBy(() -> product.getAuthors().clear())
                .isInstanceOf(UnsupportedOperationException.class);
    }
}
