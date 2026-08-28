package ma.maarifculture.analytics.repository;

import java.util.Optional;
import ma.maarifculture.analytics.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndParent(String name, Category parent);

    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
