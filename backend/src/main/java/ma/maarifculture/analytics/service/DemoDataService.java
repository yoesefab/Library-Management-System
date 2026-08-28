package ma.maarifculture.analytics.service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import ma.maarifculture.analytics.dto.DemoDataDtos.CatalogLoadResponse;
import ma.maarifculture.analytics.dto.InventoryDtos.MovementRequest;
import ma.maarifculture.analytics.model.Author;
import ma.maarifculture.analytics.model.Category;
import ma.maarifculture.analytics.model.InventoryMovementType;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.model.Publisher;
import ma.maarifculture.analytics.model.Supplier;
import ma.maarifculture.analytics.repository.AuthorRepository;
import ma.maarifculture.analytics.repository.CategoryRepository;
import ma.maarifculture.analytics.repository.InventoryMovementRepository;
import ma.maarifculture.analytics.repository.ProductRepository;
import ma.maarifculture.analytics.repository.PublisherRepository;
import ma.maarifculture.analytics.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemoDataService {

    private static final String SALES_FILE = "sample-data/sales-valid.csv";

    private final CategoryRepository categories;
    private final AuthorRepository authors;
    private final PublisherRepository publishers;
    private final SupplierRepository suppliers;
    private final ProductRepository products;
    private final InventoryMovementRepository movements;
    private final InventoryService inventoryService;
    private final CurrentUserService currentUserService;
    private final AuditService auditService;

    public DemoDataService(
            CategoryRepository categories,
            AuthorRepository authors,
            PublisherRepository publishers,
            SupplierRepository suppliers,
            ProductRepository products,
            InventoryMovementRepository movements,
            InventoryService inventoryService,
            CurrentUserService currentUserService,
            AuditService auditService) {
        this.categories = categories;
        this.authors = authors;
        this.publishers = publishers;
        this.suppliers = suppliers;
        this.products = products;
        this.movements = movements;
        this.inventoryService = inventoryService;
        this.currentUserService = currentUserService;
        this.auditService = auditService;
    }

    @Transactional
    public CatalogLoadResponse loadCatalog() {
        Counters counters = new Counters();
        Map<String, Category> categoryByName = loadCategories(counters);
        Map<String, Author> authorByName = loadAuthors(counters);
        Map<String, Publisher> publisherByName = loadPublishers(counters);
        Map<String, Supplier> supplierByName = loadSuppliers(counters);

        for (ProductSpec spec : productSpecs()) {
            Product product = products.findBySku(spec.sku()).orElse(null);
            if (product == null) {
                product = new Product(spec.sku(), spec.title(), spec.language(), spec.sellingPrice());
                product.setIsbn(spec.isbn());
                product.setDescription(spec.description());
                product.setPurchaseCost(spec.purchaseCost());
                product.configureInventory(spec.minimumStockThreshold(), spec.supplierLeadTimeDays());
                product.assignReferences(
                        categoryByName.get(spec.category()),
                        publisherByName.get(spec.publisher()),
                        supplierByName.get(spec.supplier()));
                product.addAuthor(authorByName.get(spec.author()));
                product = products.save(product);
                counters.productsCreated++;
            } else {
                counters.productsAlreadyPresent++;
            }

            if (!movements.existsByProductIdAndMovementType(product.getId(), InventoryMovementType.INITIAL_STOCK)) {
                inventoryService.record(new MovementRequest(
                        product.getId(),
                        InventoryMovementType.INITIAL_STOCK,
                        spec.initialStock(),
                        "Stock initial du jeu de démonstration synthétique"));
                counters.initialMovementsCreated++;
            }
        }

        auditService.record(
                currentUserService.required(),
                "SYNTHETIC_DEMO_CATALOG_LOADED",
                "DemoData",
                null,
                "productsCreated=" + counters.productsCreated
                        + ",initialMovementsCreated=" + counters.initialMovementsCreated);

        return new CatalogLoadResponse(
                true,
                counters.categoriesCreated,
                counters.authorsCreated,
                counters.publishersCreated,
                counters.suppliersCreated,
                counters.productsCreated,
                counters.productsAlreadyPresent,
                counters.initialMovementsCreated,
                productSpecs().size(),
                SALES_FILE,
                "Catalogue synthétique prêt. Prévisualisez puis confirmez le fichier annuel de ventes.");
    }

    private Map<String, Category> loadCategories(Counters counters) {
        Map<String, Category> result = new LinkedHashMap<>();
        for (String name : List.of("Littérature", "Informatique", "Jeunesse", "Sciences humaines", "Scolaire", "Arts")) {
            Category category = categories.findByNameIgnoreCase(name).orElseGet(() -> {
                counters.categoriesCreated++;
                return categories.save(new Category(name, null));
            });
            result.put(name, category);
        }
        return result;
    }

    private Map<String, Author> loadAuthors(Counters counters) {
        Map<String, Author> result = new LinkedHashMap<>();
        for (ProductSpec spec : productSpecs()) {
            Author author = authors.findByNameIgnoreCase(spec.author()).orElseGet(() -> {
                counters.authorsCreated++;
                return authors.save(new Author(spec.author()));
            });
            result.put(spec.author(), author);
        }
        return result;
    }

    private Map<String, Publisher> loadPublishers(Counters counters) {
        Map<String, Publisher> result = new LinkedHashMap<>();
        for (String name : List.of(
                "Éditions Atlas Démo",
                "TechLivres Démo",
                "دار المعرفة التجريبية",
                "Jeunesse Horizon Démo",
                "Atlantic Books Demo",
                "Scolaire Réussite Démo")) {
            Publisher publisher = publishers.findByNameIgnoreCase(name).orElseGet(() -> {
                counters.publishersCreated++;
                return publishers.save(new Publisher(name));
            });
            result.put(name, publisher);
        }
        return result;
    }

    private Map<String, Supplier> loadSuppliers(Counters counters) {
        Map<String, Supplier> result = new LinkedHashMap<>();
        Map<String, Integer> definitions = Map.of(
                "Distribution Maghreb Démo", 8,
                "Savoir Numérique Démo", 14,
                "Livres Jeunesse Démo", 6,
                "Fournitures Éducation Démo", 5);
        definitions.forEach((name, leadTime) -> {
            Supplier supplier = suppliers.findByNameIgnoreCase(name).orElseGet(() -> {
                counters.suppliersCreated++;
                Supplier created = new Supplier(name, leadTime);
                created.updateContact(
                        "Contact synthétique",
                        "demo@example.invalid",
                        "+212 500 000 000",
                        "Casablanca, Maroc — adresse synthétique");
                return suppliers.save(created);
            });
            result.put(name, supplier);
        });
        return result;
    }

    private List<ProductSpec> productSpecs() {
        return List.of(
                product("LIV-FR-001", "9789954000001", "Les Rues de Casablanca", "Roman urbain synthétique situé à Casablanca.", "fr", "129.00", "72.00", 20, 7, "Littérature", "Éditions Atlas Démo", "Distribution Maghreb Démo", "Nadia El Mansouri", 180),
                product("LIV-FR-002", "9789954000002", "Le Jardin des Histoires", "Recueil littéraire synthétique à rotation lente.", "fr", "98.00", "55.00", 10, 10, "Littérature", "Éditions Atlas Démo", "Distribution Maghreb Démo", "Yassine Amrani", 40),
                product("TEC-FR-003", "9789954000003", "Java Moderne en Pratique", "Guide synthétique de programmation Java.", "fr", "185.00", "110.00", 20, 12, "Informatique", "TechLivres Démo", "Savoir Numérique Démo", "Salma Berrada", 150),
                product("LIV-AR-004", "9789954000004", "حكايات من الدار البيضاء", "مجموعة قصصية تجريبية ببيانات اصطناعية.", "ar", "85.00", "44.00", 8, 8, "Littérature", "دار المعرفة التجريبية", "Distribution Maghreb Démo", "أمين العلوي", 26),
                product("JEU-FR-005", "9789954000005", "Premières Lectures du Maroc", "Livre jeunesse synthétique.", "fr", "64.00", "32.00", 15, 6, "Jeunesse", "Jeunesse Horizon Démo", "Livres Jeunesse Démo", "Imane Chafik", 70),
                product("JEU-AR-006", "9789954000006", "مغامرات صغيرة", "كتاب أطفال اصطناعي متعدد اللغات.", "ar", "58.00", "29.00", 8, 6, "Jeunesse", "Jeunesse Horizon Démo", "Livres Jeunesse Démo", "ليلى بناني", 30),
                product("LIV-EN-007", "9789954000007", "Casablanca Through Time", "Synthetic English-language cultural title.", "en", "175.50", "96.00", 8, 14, "Sciences humaines", "Atlantic Books Demo", "Savoir Numérique Démo", "Adam Clarke", 60),
                product("LIV-FR-008", "9789954000008", "Mémoire de l'Atlas", "Essai historique synthétique.", "fr", "145.00", "82.00", 10, 9, "Sciences humaines", "Éditions Atlas Démo", "Distribution Maghreb Démo", "Karim Idrissi", 60),
                product("TEC-EN-009", "9789954000009", "Practical Data Engineering", "Synthetic technical reference in English.", "en", "240.00", "150.00", 6, 15, "Informatique", "TechLivres Démo", "Savoir Numérique Démo", "Emily Stone", 30),
                product("SH-FR-010", "9789954000010", "Économie Marocaine Simplifiée", "Introduction synthétique à l'économie.", "fr", "155.00", "88.00", 8, 11, "Sciences humaines", "Éditions Atlas Démo", "Distribution Maghreb Démo", "Omar Tazi", 25),
                product("SH-AR-011", "9789954000011", "مدخل إلى تاريخ المغرب", "مرجع تاريخي اصطناعي.", "ar", "120.00", "66.00", 6, 10, "Sciences humaines", "دار المعرفة التجريبية", "Distribution Maghreb Démo", "سارة الإدريسي", 20),
                product("SCO-FR-012", "9789954000012", "Réussir les Mathématiques au Lycée", "Manuel scolaire synthétique à forte saisonnalité.", "fr", "42.00", "22.00", 15, 5, "Scolaire", "Scolaire Réussite Démo", "Fournitures Éducation Démo", "Collectif Pédagogique Démo", 90),
                product("SCO-AR-013", "9789954000013", "دليل الرياضيات المدرسي", "كتاب مدرسي اصطناعي موسمي.", "ar", "39.00", "20.00", 12, 5, "Scolaire", "Scolaire Réussite Démo", "Fournitures Éducation Démo", "الفريق التربوي التجريبي", 50),
                product("DEAD-FR-014", "9789954000014", "Encyclopédie des Arts Oubliés", "Produit synthétique sans vente récente sur la période.", "fr", "310.00", "205.00", 5, 20, "Arts", "Éditions Atlas Démo", "Distribution Maghreb Démo", "Claire Martin", 36),
                product("NEW-EN-015", "9789954000015", "Modern Book Retail Analytics", "New synthetic title with insufficient history.", "en", "210.00", "128.00", 7, 12, "Informatique", "Atlantic Books Demo", "Savoir Numérique Démo", "Daniel Brooks", 25));
    }

    private ProductSpec product(
            String sku,
            String isbn,
            String title,
            String description,
            String language,
            String sellingPrice,
            String purchaseCost,
            int minimumStockThreshold,
            int supplierLeadTimeDays,
            String category,
            String publisher,
            String supplier,
            String author,
            int initialStock) {
        return new ProductSpec(
                sku,
                isbn,
                title,
                description,
                language,
                new BigDecimal(sellingPrice),
                new BigDecimal(purchaseCost),
                minimumStockThreshold,
                supplierLeadTimeDays,
                category,
                publisher,
                supplier,
                author,
                initialStock);
    }

    private record ProductSpec(
            String sku,
            String isbn,
            String title,
            String description,
            String language,
            BigDecimal sellingPrice,
            BigDecimal purchaseCost,
            int minimumStockThreshold,
            int supplierLeadTimeDays,
            String category,
            String publisher,
            String supplier,
            String author,
            int initialStock) {
    }

    private static final class Counters {
        private int categoriesCreated;
        private int authorsCreated;
        private int publishersCreated;
        private int suppliersCreated;
        private int productsCreated;
        private int productsAlreadyPresent;
        private int initialMovementsCreated;
    }
}
