package ma.maarifculture.analytics.repository;

import java.util.Optional;
import ma.maarifculture.analytics.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    Page<Supplier> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
