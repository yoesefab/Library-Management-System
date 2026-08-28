package ma.maarifculture.analytics.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public final class DashboardDtos {
    private DashboardDtos() {}
    public record MetricPoint(String label,BigDecimal value) {}
    public record TrendPoint(LocalDate date,BigDecimal revenue,long orders,long units) {}
    public record ProductMetric(Long productId,String sku,String title,long units,BigDecimal revenue,int currentStock) {}
    public record DashboardResponse(BigDecimal totalRevenue,long numberOfOrders,long unitsSold,BigDecimal averageOrderValue,
            long currentStockQuantity,BigDecimal inventoryValue,long lowStockProducts,long outOfStockProducts,
            BigDecimal stockTurnover,BigDecimal estimatedDaysRemaining,List<ProductMetric> bestsellingProducts,
            List<ProductMetric> slowMovingProducts,List<MetricPoint> salesByCategory,List<MetricPoint> salesByLanguage,
            List<TrendPoint> revenueTrend) {}
}
