package ma.maarifculture.analytics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;
import ma.maarifculture.analytics.dto.ProductDetailResponse;
import ma.maarifculture.analytics.dto.ProductRequest;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.mapper.ProductMapper;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.repository.AuthorRepository;
import ma.maarifculture.analytics.repository.CategoryRepository;
import ma.maarifculture.analytics.repository.ProductRepository;
import ma.maarifculture.analytics.repository.PublisherRepository;
import ma.maarifculture.analytics.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private PublisherRepository publisherRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private AuthorRepository authorRepository;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(
                productRepository,
                categoryRepository,
                publisherRepository,
                supplierRepository,
                authorRepository,
                new ProductMapper());
    }

    @Test
    void createsNormalizedProductWithoutExposingEntity() {
        ProductRequest request = request(" liv-fr-001 ", null);
        when(productRepository.save(org.mockito.ArgumentMatchers.any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ProductDetailResponse response = productService.create(request);

        assertThat(response.sku()).isEqualTo("LIV-FR-001");
        assertThat(response.title()).isEqualTo("Le livre de démonstration");
        assertThat(response.sellingPrice()).isEqualByComparingTo("125.50");
        verify(productRepository).existsBySkuIgnoreCase("LIV-FR-001");
    }

    @Test
    void rejectsDuplicateSkuBeforePersistence() {
        when(productRepository.existsBySkuIgnoreCase("LIV-FR-001")).thenReturn(true);

        assertThatThrownBy(() -> productService.create(request("LIV-FR-001", null)))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("SKU");
    }

    @Test
    void deactivationPreservesProduct() {
        Product product = new Product("LIV-FR-002", "Livre historique", "fr", new BigDecimal("80.00"));
        when(productRepository.findDetailedById(42L)).thenReturn(Optional.of(product));

        productService.deactivate(42L);

        assertThat(product.isActive()).isFalse();
    }

    private ProductRequest request(String sku, String isbn) {
        return new ProductRequest(
                sku,
                isbn,
                "Le livre de démonstration",
                "Donnée entièrement synthétique.",
                "fr",
                new BigDecimal("125.50"),
                new BigDecimal("75.00"),
                3,
                7,
                null,
                null,
                null,
                Set.of());
    }
}
