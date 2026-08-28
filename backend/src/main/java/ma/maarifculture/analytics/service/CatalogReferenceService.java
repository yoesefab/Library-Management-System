package ma.maarifculture.analytics.service;

import ma.maarifculture.analytics.dto.CategoryRequest;
import ma.maarifculture.analytics.dto.CategoryResponse;
import ma.maarifculture.analytics.dto.NamedReferenceRequest;
import ma.maarifculture.analytics.dto.NamedReferenceResponse;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.dto.SupplierRequest;
import ma.maarifculture.analytics.dto.SupplierResponse;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.model.Author;
import ma.maarifculture.analytics.model.Category;
import ma.maarifculture.analytics.model.Publisher;
import ma.maarifculture.analytics.model.Supplier;
import ma.maarifculture.analytics.repository.AuthorRepository;
import ma.maarifculture.analytics.repository.CategoryRepository;
import ma.maarifculture.analytics.repository.PublisherRepository;
import ma.maarifculture.analytics.repository.SupplierRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogReferenceService {

    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final SupplierRepository supplierRepository;

    public CatalogReferenceService(
            CategoryRepository categoryRepository,
            AuthorRepository authorRepository,
            PublisherRepository publisherRepository,
            SupplierRepository supplierRepository) {
        this.categoryRepository = categoryRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.supplierRepository = supplierRepository;
    }

    public PageResponse<CategoryResponse> categories(String query, int page, int size) {
        return PageResponse.from(categoryRepository.findByNameContainingIgnoreCase(
                        normalizedQuery(query), page(page, size))
                .map(this::categoryResponse));
    }

    public PageResponse<NamedReferenceResponse> authors(String query, int page, int size) {
        return PageResponse.from(authorRepository.findByNameContainingIgnoreCase(
                        normalizedQuery(query), page(page, size))
                .map(author -> new NamedReferenceResponse(author.getId(), author.getName())));
    }

    public PageResponse<NamedReferenceResponse> publishers(String query, int page, int size) {
        return PageResponse.from(publisherRepository.findByNameContainingIgnoreCase(
                        normalizedQuery(query), page(page, size))
                .map(publisher -> new NamedReferenceResponse(publisher.getId(), publisher.getName())));
    }

    public PageResponse<SupplierResponse> suppliers(String query, int page, int size) {
        return PageResponse.from(supplierRepository.findByNameContainingIgnoreCase(
                        normalizedQuery(query), page(page, size))
                .map(this::supplierResponse));
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category parent = request.parentId() == null
                ? null
                : categoryRepository.findById(request.parentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Catégorie parente introuvable : " + request.parentId()));
        if (categoryRepository.existsByNameIgnoreCaseAndParent(request.name().trim(), parent)) {
            throw new ConflictException("Cette catégorie existe déjà au même niveau.");
        }
        return categoryResponse(categoryRepository.save(new Category(request.name(), parent)));
    }

    @Transactional
    public NamedReferenceResponse createAuthor(NamedReferenceRequest request) {
        if (authorRepository.existsByNameIgnoreCase(request.name().trim())) {
            throw new ConflictException("Cet auteur existe déjà.");
        }
        Author author = authorRepository.save(new Author(request.name()));
        return new NamedReferenceResponse(author.getId(), author.getName());
    }

    @Transactional
    public NamedReferenceResponse createPublisher(NamedReferenceRequest request) {
        if (publisherRepository.existsByNameIgnoreCase(request.name().trim())) {
            throw new ConflictException("Cet éditeur existe déjà.");
        }
        Publisher publisher = publisherRepository.save(new Publisher(request.name()));
        return new NamedReferenceResponse(publisher.getId(), publisher.getName());
    }

    @Transactional
    public SupplierResponse createSupplier(SupplierRequest request) {
        if (supplierRepository.existsByNameIgnoreCase(request.name().trim())) {
            throw new ConflictException("Ce fournisseur existe déjà.");
        }
        Supplier supplier = new Supplier(request.name(), request.defaultLeadTimeDays());
        supplier.updateContact(request.contactName(), request.email(), request.phone(), request.address());
        return supplierResponse(supplierRepository.save(supplier));
    }

    private PageRequest page(int page, int size) {
        return PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
    }

    private String normalizedQuery(String query) {
        return query == null ? "" : query.trim();
    }

    private CategoryResponse categoryResponse(Category category) {
        NamedReferenceResponse parent = category.getParent() == null
                ? null
                : new NamedReferenceResponse(category.getParent().getId(), category.getParent().getName());
        return new CategoryResponse(category.getId(), category.getName(), parent);
    }

    private SupplierResponse supplierResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactName(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.getDefaultLeadTimeDays(),
                supplier.isActive(),
                supplier.getCreatedAt(),
                supplier.getUpdatedAt());
    }
}
