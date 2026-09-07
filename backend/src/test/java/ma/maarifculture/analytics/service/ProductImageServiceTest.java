package ma.maarifculture.analytics.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.util.Optional;
import ma.maarifculture.analytics.mapper.ProductMapper;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
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

    private ProductImageService service() {
        ProductRepository repository = mock(ProductRepository.class);
        when(repository.findDetailedById(1L)).thenReturn(Optional.of(mock(Product.class)));
        return new ProductImageService(directory.toString(), repository, mock(ProductMapper.class));
    }
}
