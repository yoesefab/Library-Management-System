package ma.maarifculture.analytics.repository;

import java.util.Optional;
import ma.maarifculture.analytics.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockAlertRepository extends JpaRepository<StockAlert,Long> {
    Page<StockAlert> findByStatus(AlertStatus status, Pageable pageable);
    Page<StockAlert> findByAlertType(AlertType type, Pageable pageable);
    Page<StockAlert> findByStatusAndAlertType(AlertStatus status, AlertType type, Pageable pageable);
    Optional<StockAlert> findFirstByProductIdAndAlertTypeAndStatusNot(Long productId, AlertType type, AlertStatus status);
    long countByAlertTypeAndStatusNot(AlertType type, AlertStatus status);
}
