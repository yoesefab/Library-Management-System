package ma.maarifculture.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import ma.maarifculture.analytics.model.*;

public final class InventoryDtos {
    private InventoryDtos() {}
    public record MovementRequest(@NotNull Long productId, @NotNull InventoryMovementType type, int quantity, @NotBlank String reason) {}
    public record MovementResponse(Long id, Long productId, String sku, String productTitle, InventoryMovementType type,
                                   int quantity, int resultingStock, String reason, Long orderId, String createdBy, Instant occurredAt) {}
    public record StockResponse(Long productId, String sku, String title, int currentStock, int minimumThreshold, boolean active) {}
    public record AlertResponse(Long id, Long productId, String sku, String productTitle, AlertType type, AlertSeverity severity,
                                String explanation, AlertStatus status, Instant createdAt, Instant acknowledgedAt, Instant resolvedAt) {}
}
