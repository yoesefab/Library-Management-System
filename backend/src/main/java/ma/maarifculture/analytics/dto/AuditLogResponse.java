package ma.maarifculture.analytics.dto;

import java.time.Instant;

public record AuditLogResponse(Long id, Long userId, String userEmail, String action, String entityType,
                               String entityId, Instant occurredAt, String metadata) {}
