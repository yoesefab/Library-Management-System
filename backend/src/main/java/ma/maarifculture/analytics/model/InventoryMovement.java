package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventory_movement")
public class InventoryMovement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name="product_id") private Product product;
    @Enumerated(EnumType.STRING) @Column(name="movement_type", nullable=false, length=30) private InventoryMovementType movementType;
    @Column(nullable=false) private int quantity;
    @Column(nullable=false, length=500) private String reason;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="related_order_id") private SalesOrder relatedOrder;
    @ManyToOne(fetch = FetchType.LAZY, optional=false) @JoinColumn(name="created_by_user_id") private AppUser createdBy;
    @Column(name="occurred_at", nullable=false, updatable=false) private Instant occurredAt;

    protected InventoryMovement() {}
    public InventoryMovement(Product product, InventoryMovementType type, int quantity, String reason, SalesOrder order, AppUser user) {
        this.product=product; this.movementType=type; this.quantity=quantity; this.reason=reason.trim(); this.relatedOrder=order; this.createdBy=user; this.occurredAt=Instant.now();
    }
    public Long getId(){return id;} public Product getProduct(){return product;} public InventoryMovementType getMovementType(){return movementType;}
    public int getQuantity(){return quantity;} public String getReason(){return reason;} public SalesOrder getRelatedOrder(){return relatedOrder;}
    public AppUser getCreatedBy(){return createdBy;} public Instant getOccurredAt(){return occurredAt;}
}
