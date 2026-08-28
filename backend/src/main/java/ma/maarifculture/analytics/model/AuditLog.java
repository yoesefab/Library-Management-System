package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_log")
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private AppUser user;
    @Column(nullable = false, length = 100)
    private String action;
    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;
    @Column(name = "entity_id", length = 100)
    private String entityId;
    @Column(name = "occurred_at", nullable = false, updatable = false)
    private Instant occurredAt;
    @Column(length = 4000)
    private String metadata;

    protected AuditLog() {}
    public AuditLog(AppUser user, String action, String entityType, String entityId, String metadata) {
        this.user = user;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.metadata = metadata;
        this.occurredAt = Instant.now();
    }
    public Long getId() { return id; }
    public AppUser getUser() { return user; }
    public String getAction() { return action; }
    public String getEntityType() { return entityType; }
    public String getEntityId() { return entityId; }
    public Instant getOccurredAt() { return occurredAt; }
    public String getMetadata() { return metadata; }
}
