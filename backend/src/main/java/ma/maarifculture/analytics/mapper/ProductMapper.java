package ma.maarifculture.analytics.mapper;

import java.util.Comparator;
import ma.maarifculture.analytics.dto.ProductDetailResponse;
import ma.maarifculture.analytics.dto.ProductSummaryResponse;
import ma.maarifculture.analytics.model.Author;
import ma.maarifculture.analytics.model.Category;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.model.Publisher;
import ma.maarifculture.analytics.model.Supplier;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductSummaryResponse toSummary(Product product) {
        return new ProductSummaryResponse(
                product.getId(),
                product.getSku(),
                product.getIsbn(),
                product.getTitle(),
                product.getLanguage(),
                product.getSellingPrice(),
                name(product.getCategory()),
                name(product.getPublisher()),
                product.isActive());
    }

    public ProductDetailResponse toDetail(Product product) {
        return new ProductDetailResponse(
                product.getId(),
                product.getSku(),
                product.getIsbn(),
                product.getTitle(),
                product.getDescription(),
                product.getLanguage(),
                product.getSellingPrice(),
                product.getPurchaseCost(),
                product.getMinimumStockThreshold(),
                product.getSupplierLeadTimeDays(),
                reference(product.getCategory()),
                reference(product.getPublisher()),
                reference(product.getSupplier()),
                product.getAuthors().stream()
                        .sorted(Comparator.comparing(Author::getName))
                        .map(author -> new ProductDetailResponse.Reference(author.getId(), author.getName()))
                        .toList(),
                product.isActive(),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }

    private String name(Category category) {
        return category == null ? null : category.getName();
    }

    private String name(Publisher publisher) {
        return publisher == null ? null : publisher.getName();
    }

    private ProductDetailResponse.Reference reference(Category category) {
        return category == null ? null : new ProductDetailResponse.Reference(category.getId(), category.getName());
    }

    private ProductDetailResponse.Reference reference(Publisher publisher) {
        return publisher == null ? null : new ProductDetailResponse.Reference(publisher.getId(), publisher.getName());
    }

    private ProductDetailResponse.Reference reference(Supplier supplier) {
        return supplier == null ? null : new ProductDetailResponse.Reference(supplier.getId(), supplier.getName());
    }
}
