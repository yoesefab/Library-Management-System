package ma.maarifculture.analytics.dto;

import java.math.BigDecimal;import java.time.*;import ma.maarifculture.analytics.model.*;
public final class ForecastDtos {private ForecastDtos(){}
    public record ForecastResponse(Long id,Long productId,String sku,String title,String imageUrl,LocalDate periodStart,LocalDate periodEnd,ForecastMethod method,BigDecimal predictedDemand,String accuracyMetric,BigDecimal accuracyValue,Instant generatedAt,String parameters,String explanation){}
    public record RecommendationResponse(Long id,Long productId,String sku,String title,String imageUrl,int currentStock,BigDecimal predictedDemand,int leadTimeDays,int safetyStock,int reorderPoint,int recommendedQuantity,String explanation,Instant generatedAt,RecommendationStatus status){}
    public record StatusRequest(RecommendationStatus status){}
}
