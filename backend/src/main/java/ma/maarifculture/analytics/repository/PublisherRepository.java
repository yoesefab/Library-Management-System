package ma.maarifculture.analytics.repository;

import java.util.Optional;
import ma.maarifculture.analytics.model.Publisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublisherRepository extends JpaRepository<Publisher, Long> {

    Optional<Publisher> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    Page<Publisher> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
