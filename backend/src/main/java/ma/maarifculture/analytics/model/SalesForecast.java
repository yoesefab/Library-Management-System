package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;

@Entity @Table(name="sales_forecast")
public class SalesForecast {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="product_id") private Product product;
    @Column(name="forecast_period_start",nullable=false) private LocalDate periodStart;
    @Column(name="forecast_period_end",nullable=false) private LocalDate periodEnd;
    @Enumerated(EnumType.STRING) @Column(name="forecast_method",nullable=false,length=40) private ForecastMethod method;
    @Column(name="predicted_demand",nullable=false,precision=19,scale=4) private BigDecimal predictedDemand;
    @Column(name="accuracy_metric_name",length=20) private String accuracyMetricName;
    @Column(name="accuracy_metric_value",precision=19,scale=6) private BigDecimal accuracyMetricValue;
    @Column(name="generated_at",nullable=false,updatable=false) private Instant generatedAt;
    @Column(name="model_parameters",nullable=false,length=2000) private String modelParameters;
    @Column(nullable=false,length=2000) private String explanation;
    protected SalesForecast() {}
    public SalesForecast(Product p,LocalDate start,LocalDate end,ForecastMethod method,BigDecimal demand,String metric,BigDecimal value,String parameters,String explanation){product=p;periodStart=start;periodEnd=end;this.method=method;predictedDemand=demand;accuracyMetricName=metric;accuracyMetricValue=value;modelParameters=parameters;this.explanation=explanation;generatedAt=Instant.now();}
    public Long getId(){return id;} public Product getProduct(){return product;} public LocalDate getPeriodStart(){return periodStart;} public LocalDate getPeriodEnd(){return periodEnd;} public ForecastMethod getMethod(){return method;} public BigDecimal getPredictedDemand(){return predictedDemand;} public String getAccuracyMetricName(){return accuracyMetricName;} public BigDecimal getAccuracyMetricValue(){return accuracyMetricValue;} public Instant getGeneratedAt(){return generatedAt;} public String getModelParameters(){return modelParameters;} public String getExplanation(){return explanation;}
}
