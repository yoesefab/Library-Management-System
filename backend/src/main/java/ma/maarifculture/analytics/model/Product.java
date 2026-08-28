package ma.maarifculture.analytics.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, unique = true, length = 80)
    private String sku;

    @Size(max = 20)
    @Column(unique = true, length = 20)
    private String isbn;

    @NotBlank
    @Size(max = 300)
    @Column(nullable = false, length = 300)
    private String title;

    @Size(max = 4000)
    @Column(length = 4000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @NotBlank
    @Size(max = 10)
    @Column(nullable = false, length = 10)
    private String language;

    @DecimalMin("0.00")
    @Digits(integer = 17, fraction = 2)
    @Column(name = "selling_price", nullable = false, precision = 19, scale = 2)
    private BigDecimal sellingPrice;

    @DecimalMin("0.00")
    @Digits(integer = 17, fraction = 2)
    @Column(name = "purchase_cost", precision = 19, scale = 2)
    private BigDecimal purchaseCost;

    @PositiveOrZero
    @Column(name = "minimum_stock_threshold", nullable = false)
    private int minimumStockThreshold;

    @PositiveOrZero
    @Column(name = "supplier_lead_time_days")
    private Integer supplierLeadTimeDays;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToMany
    @JoinTable(
            name = "product_author",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id"))
    private Set<Author> authors = new LinkedHashSet<>();

    protected Product() {
        // Required by JPA.
    }

    public Product(String sku, String title, String language, BigDecimal sellingPrice) {
        this.sku = CatalogValues.requiredText(sku, "SKU").toUpperCase(Locale.ROOT);
        this.title = CatalogValues.requiredText(title, "Product title");
        this.language = CatalogValues.requiredText(language, "Language").toLowerCase(Locale.ROOT);
        this.sellingPrice = CatalogValues.money(sellingPrice, "Selling price");
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void assignReferences(Category category, Publisher publisher, Supplier supplier) {
        this.category = category;
        this.publisher = publisher;
        this.supplier = supplier;
    }

    public void addAuthor(Author author) {
        authors.add(CatalogValues.required(author, "Author"));
    }

    public void replaceAuthors(Set<Author> authors) {
        this.authors.clear();
        authors.forEach(this::addAuthor);
    }

    public void updateDetails(String sku, String title, String language, BigDecimal sellingPrice) {
        this.sku = CatalogValues.requiredText(sku, "SKU").toUpperCase(Locale.ROOT);
        this.title = CatalogValues.requiredText(title, "Product title");
        this.language = CatalogValues.requiredText(language, "Language").toLowerCase(Locale.ROOT);
        this.sellingPrice = CatalogValues.money(sellingPrice, "Selling price");
    }

    public void setIsbn(String isbn) {
        this.isbn = CatalogValues.optionalText(isbn);
    }

    public void setDescription(String description) {
        this.description = CatalogValues.optionalText(description);
    }

    public void configureInventory(int minimumStockThreshold, Integer supplierLeadTimeDays) {
        this.minimumStockThreshold = CatalogValues.nonNegative(minimumStockThreshold, "Minimum stock threshold");
        this.supplierLeadTimeDays = supplierLeadTimeDays == null
                ? null
                : CatalogValues.nonNegative(supplierLeadTimeDays, "Supplier lead time");
    }

    public void setPurchaseCost(BigDecimal purchaseCost) {
        this.purchaseCost = purchaseCost == null ? null : CatalogValues.money(purchaseCost, "Purchase cost");
    }

    public void deactivate() {
        active = false;
    }

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public Category getCategory() {
        return category;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public String getLanguage() {
        return language;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public BigDecimal getPurchaseCost() {
        return purchaseCost;
    }

    public int getMinimumStockThreshold() {
        return minimumStockThreshold;
    }

    public Integer getSupplierLeadTimeDays() {
        return supplierLeadTimeDays;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Set<Author> getAuthors() {
        return Collections.unmodifiableSet(authors);
    }
}
