package ma.maarifculture.analytics.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import ma.maarifculture.analytics.model.*;

public final class OrderDtos {
    private OrderDtos() {}
    public record ItemRequest(@NotNull Long productId,@Min(1) int quantity,@NotNull @DecimalMin("0.00") BigDecimal unitPrice,@NotNull @DecimalMin("0.00") BigDecimal discount) {}
    public record CreateRequest(@Size(max=120) String externalReference,@NotNull Instant orderDate,@NotNull OrderStatus status,@Size(max=120) String customerCity,@NotEmpty List<@Valid ItemRequest> items) {}
    public record ItemResponse(Long id,Long productId,String sku,String title,String imageUrl,int quantity,BigDecimal unitPrice,BigDecimal discount,BigDecimal lineTotal) {}
    public record OrderResponse(Long id,String externalReference,Instant orderDate,OrderStatus status,String customerCity,BigDecimal totalAmount,OrderSource source,List<ItemResponse> items,Instant createdAt) {}
    public record StatusRequest(@NotNull OrderStatus status) {}
}
