package ma.maarifculture.analytics.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import ma.maarifculture.analytics.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SalesOrderRepository extends JpaRepository<SalesOrder,Long> {
    Optional<SalesOrder> findBySourceAndExternalReference(OrderSource source,String reference);
    boolean existsBySourceAndExternalReference(OrderSource source,String reference);
    @EntityGraph(attributePaths={"items","items.product"}) @Query("select o from SalesOrder o where o.id=:id") Optional<SalesOrder> findDetailedById(@Param("id") Long id);
    Page<SalesOrder> findByStatus(OrderStatus status,Pageable pageable);
    @Query("select o from SalesOrder o where o.status='COMPLETED' and o.orderDate between :start and :end") List<SalesOrder> completedBetween(@Param("start") Instant start,@Param("end") Instant end);
}
