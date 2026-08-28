package ma.maarifculture.analytics.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;
import ma.maarifculture.analytics.dto.CategoryRequest;
import ma.maarifculture.analytics.dto.CategoryResponse;
import ma.maarifculture.analytics.dto.NamedReferenceRequest;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.model.Category;
import ma.maarifculture.analytics.repository.AuthorRepository;
import ma.maarifculture.analytics.repository.CategoryRepository;
import ma.maarifculture.analytics.repository.PublisherRepository;
import ma.maarifculture.analytics.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CatalogReferenceServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private AuthorRepository authorRepository;
    @Mock private PublisherRepository publisherRepository;
    @Mock private SupplierRepository supplierRepository;

    private CatalogReferenceService service;

    @BeforeEach
    void setUp() {
        service = new CatalogReferenceService(
                categoryRepository, authorRepository, publisherRepository, supplierRepository);
    }

    @Test
    void createsChildCategoryWithExplicitParent() {
        Category parent = new Category("Livres scolaires", null);
        when(categoryRepository.findById(4L)).thenReturn(Optional.of(parent));
        when(categoryRepository.save(org.mockito.ArgumentMatchers.any(Category.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CategoryResponse response = service.createCategory(new CategoryRequest("Primaire", 4L));

        assertThat(response.name()).isEqualTo("Primaire");
        assertThat(response.parent().name()).isEqualTo("Livres scolaires");
    }

    @Test
    void rejectsDuplicateAuthorIgnoringCase() {
        when(authorRepository.existsByNameIgnoreCase("Auteur Démo")).thenReturn(true);

        assertThatThrownBy(() -> service.createAuthor(new NamedReferenceRequest("Auteur Démo")))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("auteur");
    }
}
