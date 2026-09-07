package ma.maarifculture.analytics.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.util.Optional;
import ma.maarifculture.analytics.mapper.ProductMapper;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mock.web.MockMultipartFile;

class ProductImageServiceTest {
    @TempDir Path directory;

    @Test
    void rejectsAnOversizedImageWithAFrenchMessage() {
        ProductImageService service = service();
        var file = new MockMultipartFile("file", "large.jpg", "image/jpeg", new byte[(int) ProductImageService.MAX_BYTES + 1]);
        assertEquals("L’image ne doit pas dépasser 5 Mo.", assertThrows(IllegalArgumentException.class, () -> service.store(1L, file)).getMessage());
    }

    @Test
    void rejectsExecutableContentDisguisedAsAnImage() {
        ProductImageService service = service();
        var file = new MockMultipartFile("file", "cover.jpg", "image/jpeg", "#!/bin/sh\necho unsafe".getBytes());
        assertEquals("Format non autorisé. Utilisez une image JPG, PNG ou WebP valide.", assertThrows(IllegalArgumentException.class, () -> service.store(1L, file)).getMessage());
    }

    @Test
    void installsABundledDemoCoverWhenTheProductHasNoImage() throws Exception {
        ProductRepository repository = mock(ProductRepository.class);
        Product product = mock(Product.class);
        when(product.getSku()).thenReturn("LIV-FR-001");
        ProductImageService service = new ProductImageService(directory.toString(), repository, mock(ProductMapper.class));
        service.initialize();

        boolean installed = service.installBundledDemoCover(product, new ByteArrayResource("cover".getBytes()));

        assertTrue(installed);
        verify(product).setImageKey("demo-LIV-FR-001.jpg");
        verify(repository).saveAndFlush(product);
        assertEquals("cover", java.nio.file.Files.readString(directory.resolve("demo-LIV-FR-001.jpg")));
    }

    @Test
    void preservesAnExistingProductImage() {
        ProductRepository repository = mock(ProductRepository.class);
        Product product = mock(Product.class);
        when(product.getImageKey()).thenReturn("custom.jpg");
        ProductImageService service = new ProductImageService(directory.toString(), repository, mock(ProductMapper.class));

        boolean installed = service.installBundledDemoCover(product, new ByteArrayResource("cover".getBytes()));

        assertFalse(installed);
        verify(repository, never()).saveAndFlush(product);
    }

    private ProductImageService service() {
        ProductRepository repository = mock(ProductRepository.class);
        when(repository.findDetailedById(1L)).thenReturn(Optional.of(mock(Product.class)));
        return new ProductImageService(directory.toString(), repository, mock(ProductMapper.class));
    }
}
