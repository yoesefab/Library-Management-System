package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity @Table(name="reorder_recommendation")
public class ReorderRecommendation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="product_id") private Product product;
    @Column(name="current_stock",nullable=false) private int currentStock;
    @Column(name="predicted_demand",nullable=false,precision=19,scale=4) private BigDecimal predictedDemand;
    @Column(name="lead_time_days",nullable=false) private int leadTimeDays;
    @Column(name="safety_stock",nullable=false) private int safetyStock;
    @Column(name="reorder_point",nullable=false) private int reorderPoint;
    @Column(name="recommended_quantity",nullable=false) private int recommendedQuantity;
    @Column(nullable=false,length=2000) private String explanation;
    @Column(name="generated_at",nullable=false,updatable=false) private Instant generatedAt;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private RecommendationStatus status=RecommendationStatus.PROPOSED;
    protected ReorderRecommendation() {}
    public ReorderRecommendation(Product p,int stock,BigDecimal demand,int lead,int safety,int point,int quantity,String explanation){product=p;currentStock=stock;predictedDemand=demand;leadTimeDays=lead;safetyStock=safety;reorderPoint=point;recommendedQuantity=quantity;this.explanation=explanation;generatedAt=Instant.now();}
    public void changeStatus(RecommendationStatus status){this.status=status;}
    public Long getId(){return id;} public Product getProduct(){return product;} public int getCurrentStock(){return currentStock;} public BigDecimal getPredictedDemand(){return predictedDemand;} public int getLeadTimeDays(){return leadTimeDays;} public int getSafetyStock(){return safetyStock;} public int getReorderPoint(){return reorderPoint;} public int getRecommendedQuantity(){return recommendedQuantity;} public String getExplanation(){return explanation;} public Instant getGeneratedAt(){return generatedAt;} public RecommendationStatus getStatus(){return status;}
}
