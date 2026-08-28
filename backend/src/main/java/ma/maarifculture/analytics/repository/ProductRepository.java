package ma.maarifculture.analytics.repository;

import java.util.Optional;
import ma.maarifculture.analytics.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    Optional<Product> findByIsbn(String isbn);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);

    boolean existsByIsbn(String isbn);

    boolean existsByIsbnAndIdNot(String isbn, Long id);

    @EntityGraph(attributePaths = {"category", "publisher", "supplier"})
    @Query("""
            select p from Product p
            left join p.category category
            where (:query = ''
                or lower(p.title) like lower(concat('%', :query, '%'))
                or lower(p.sku) like lower(concat('%', :query, '%'))
                or lower(coalesce(p.isbn, '')) like lower(concat('%', :query, '%')))
              and (:active is null or p.active = :active)
              and (:language is null or p.language = :language)
              and (:categoryId is null or category.id = :categoryId)
            """)
    Page<Product> search(
            @Param("query") String query,
            @Param("active") Boolean active,
            @Param("language") String language,
            @Param("categoryId") Long categoryId,
            Pageable pageable);

    @EntityGraph(attributePaths = {"category", "publisher", "supplier", "authors"})
    @Query("select p from Product p where p.id = :id")
    Optional<Product> findDetailedById(@Param("id") Long id);
}
