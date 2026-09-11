package ma.maarifculture.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
import ma.maarifculture.analytics.model.*;

public final class InventoryDtos {
    private InventoryDtos() {}
    public record MovementRequest(@NotNull @Positive Long productId, @NotNull InventoryMovementType type, int quantity,
                                  @NotBlank @Size(max=500) String reason) {}
    public record MovementResponse(Long id, Long productId, String sku, String productTitle, String imageUrl, InventoryMovementType type,
                                   int quantity, int resultingStock, String reason, Long orderId, String createdBy, Instant occurredAt) {}
    public record StockResponse(Long productId, String sku, String title, String imageUrl, int currentStock, int minimumThreshold, boolean active) {}
    public record AlertResponse(Long id, Long productId, String sku, String productTitle, String imageUrl, AlertType type, AlertSeverity severity,
                                String explanation, AlertStatus status, Instant createdAt, Instant acknowledgedAt, Instant resolvedAt) {}
}
