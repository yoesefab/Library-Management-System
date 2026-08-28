package ma.maarifculture.analytics.service;

import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.dto.ProductDetailResponse;
import ma.maarifculture.analytics.dto.ProductRequest;
import ma.maarifculture.analytics.dto.ProductSummaryResponse;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.mapper.ProductMapper;
import ma.maarifculture.analytics.model.Author;
import ma.maarifculture.analytics.model.Category;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.model.Publisher;
import ma.maarifculture.analytics.model.Supplier;
import ma.maarifculture.analytics.repository.AuthorRepository;
import ma.maarifculture.analytics.repository.CategoryRepository;
import ma.maarifculture.analytics.repository.ProductRepository;
import ma.maarifculture.analytics.repository.PublisherRepository;
import ma.maarifculture.analytics.repository.SupplierRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;
    private final SupplierRepository supplierRepository;
    private final AuthorRepository authorRepository;
    private final ProductMapper productMapper;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            PublisherRepository publisherRepository,
            SupplierRepository supplierRepository,
            AuthorRepository authorRepository,
            ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.publisherRepository = publisherRepository;
        this.supplierRepository = supplierRepository;
        this.authorRepository = authorRepository;
        this.productMapper = productMapper;
    }

    public PageResponse<ProductSummaryResponse> search(
            String query, Boolean active, String language, Long categoryId, int page, int size) {
        String normalizedQuery = query == null ? "" : query.trim();
        String normalizedLanguage = language == null || language.isBlank()
                ? null
                : language.trim().toLowerCase(Locale.ROOT);
        return PageResponse.from(productRepository.search(
                normalizedQuery,
                active,
                normalizedLanguage,
                categoryId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "title")))
                .map(productMapper::toSummary));
    }

    public ProductDetailResponse findById(Long id) {
        return productMapper.toDetail(requiredProduct(id));
    }

    @Transactional
    public ProductDetailResponse create(ProductRequest request) {
        String sku = normalizeSku(request.sku());
        ensureUnique(sku, request.isbn(), null);
        Product product = new Product(sku, request.title(), request.language(), request.sellingPrice());
        apply(request, product);
        return productMapper.toDetail(productRepository.save(product));
    }

    @Transactional
    public ProductDetailResponse update(Long id, ProductRequest request) {
        Product product = requiredProduct(id);
        String sku = normalizeSku(request.sku());
        ensureUnique(sku, request.isbn(), id);
        product.updateDetails(sku, request.title(), request.language(), request.sellingPrice());
        apply(request, product);
        return productMapper.toDetail(product);
    }

    @Transactional
    public void deactivate(Long id) {
        requiredProduct(id).deactivate();
    }

    private void apply(ProductRequest request, Product product) {
        product.setIsbn(request.isbn());
        product.setDescription(request.description());
        product.setPurchaseCost(request.purchaseCost());
        product.configureInventory(request.minimumStockThreshold(), request.supplierLeadTimeDays());
        product.assignReferences(
                findCategory(request.categoryId()),
                findPublisher(request.publisherId()),
                findSupplier(request.supplierId()));
        product.replaceAuthors(findAuthors(request.authorIds()));
    }

    private Product requiredProduct(Long id) {
        return productRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + id));
    }

    private Category findCategory(Long id) {
        if (id == null) {
            return null;
        }
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable : " + id));
    }

    private Publisher findPublisher(Long id) {
        if (id == null) {
            return null;
        }
        return publisherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Éditeur introuvable : " + id));
    }

    private Supplier findSupplier(Long id) {
        if (id == null) {
            return null;
        }
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fournisseur introuvable : " + id));
        if (!supplier.isActive()) {
            throw new ConflictException("Le fournisseur sélectionné est désactivé.");
        }
        return supplier;
    }

    private Set<Author> findAuthors(Set<Long> ids) {
        Set<Author> authors = new LinkedHashSet<>();
        ids.forEach(id -> authors.add(authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auteur introuvable : " + id))));
        return authors;
    }

    private void ensureUnique(String sku, String isbn, Long currentId) {
        boolean skuExists = currentId == null
                ? productRepository.existsBySkuIgnoreCase(sku)
                : productRepository.existsBySkuIgnoreCaseAndIdNot(sku, currentId);
        if (skuExists) {
            throw new ConflictException("Un produit utilise déjà ce SKU.");
        }

        if (isbn == null || isbn.isBlank()) {
            return;
        }
        boolean isbnExists = currentId == null
                ? productRepository.existsByIsbn(isbn.trim())
                : productRepository.existsByIsbnAndIdNot(isbn.trim(), currentId);
        if (isbnExists) {
            throw new ConflictException("Un produit utilise déjà cet ISBN.");
        }
    }

    private String normalizeSku(String sku) {
        return sku.trim().toUpperCase(Locale.ROOT);
    }
}
