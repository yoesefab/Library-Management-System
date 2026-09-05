package ma.maarifculture.analytics.repository;

import java.time.Instant;
import java.util.List;
import ma.maarifculture.analytics.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
    @Query("select i from OrderItem i join fetch i.product p join i.order o where o.status='COMPLETED' and o.orderDate between :start and :end")
    List<OrderItem> soldBetween(@Param("start") Instant start,@Param("end") Instant end);
    @Query("select i from OrderItem i join fetch i.product p join fetch i.order o where o.status='COMPLETED' and o.orderDate>=:start and o.orderDate<:end")
    List<OrderItem> soldInPeriod(@Param("start") Instant start,@Param("end") Instant end);
    @Query("select i from OrderItem i join fetch i.order o where i.product.id=:productId and o.status='COMPLETED' order by o.orderDate")
    List<OrderItem> completedForProduct(@Param("productId") Long productId);
}
