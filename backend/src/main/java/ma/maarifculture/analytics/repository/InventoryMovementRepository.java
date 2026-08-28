package ma.maarifculture.analytics.repository;

import java.time.Instant;
import java.util.List;
import ma.maarifculture.analytics.model.InventoryMovement;
import ma.maarifculture.analytics.model.InventoryMovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement,Long> {
    @Query("select coalesce(sum(m.quantity),0) from InventoryMovement m where m.product.id=:productId")
    long currentStock(@Param("productId") Long productId);
    Page<InventoryMovement> findByProductId(Long productId, Pageable pageable);
    Page<InventoryMovement> findByMovementType(InventoryMovementType type, Pageable pageable);
    boolean existsByProductIdAndMovementType(Long productId, InventoryMovementType type);
    boolean existsByRelatedOrderIdAndProductIdAndMovementType(Long orderId, Long productId, InventoryMovementType type);
    @Query("select coalesce(sum(m.quantity),0) from InventoryMovement m where m.occurredAt<=:at")
    long totalStockAt(@Param("at") Instant at);
    @Query("select m from InventoryMovement m where m.product.id=:productId order by m.occurredAt desc")
    List<InventoryMovement> history(@Param("productId") Long productId);
}
