package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="stock_alert")
public class StockAlert {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="product_id") private Product product;
    @Enumerated(EnumType.STRING) @Column(name="alert_type",nullable=false,length=40) private AlertType alertType;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private AlertSeverity severity;
    @Column(nullable=false,length=1000) private String explanation;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private AlertStatus status=AlertStatus.OPEN;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
    @Column(name="acknowledged_at") private Instant acknowledgedAt;
    @Column(name="resolved_at") private Instant resolvedAt;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="acknowledged_by_user_id") private AppUser acknowledgedBy;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="resolved_by_user_id") private AppUser resolvedBy;
    protected StockAlert() {}
    public StockAlert(Product p, AlertType t, AlertSeverity s, String explanation){product=p;alertType=t;severity=s;this.explanation=explanation;createdAt=Instant.now();}
    public void acknowledge(AppUser user){if(status==AlertStatus.RESOLVED)return;status=AlertStatus.ACKNOWLEDGED;acknowledgedAt=Instant.now();acknowledgedBy=user;}
    public void resolve(AppUser user){status=AlertStatus.RESOLVED;resolvedAt=Instant.now();resolvedBy=user;}
    public Long getId(){return id;} public Product getProduct(){return product;} public AlertType getAlertType(){return alertType;} public AlertSeverity getSeverity(){return severity;}
    public String getExplanation(){return explanation;} public AlertStatus getStatus(){return status;} public Instant getCreatedAt(){return createdAt;}
    public Instant getAcknowledgedAt(){return acknowledgedAt;} public Instant getResolvedAt(){return resolvedAt;}
}
