package ma.maarifculture.analytics.service;

import java.math.*;
import java.time.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import ma.maarifculture.analytics.dto.DashboardDtos.*;
import ma.maarifculture.analytics.model.*;
import ma.maarifculture.analytics.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional(readOnly=true)
public class DashboardService {
    private final OrderItemRepository items;private final SalesOrderRepository orders;private final ProductRepository products;private final InventoryService inventory;private final ZoneId zone;
    public DashboardService(OrderItemRepository items,SalesOrderRepository orders,ProductRepository products,InventoryService inventory,@Value("${maarif.business-timezone}") String zone){this.items=items;this.orders=orders;this.products=products;this.inventory=inventory;this.zone=ZoneId.of(zone);}
    public DashboardResponse dashboard(Instant start,Instant end,Long categoryId,String language,Long authorId,Long publisherId){
        if(start==null||end==null||end.isBefore(start))throw new IllegalArgumentException("Une plage de dates valide est requise.");
        List<OrderItem> sold=items.soldBetween(start,end).stream().filter(i->matches(i.getProduct(),categoryId,language,authorId,publisherId)).toList();
        BigDecimal revenue=sold.stream().map(OrderItem::getLineTotal).reduce(BigDecimal.ZERO,BigDecimal::add);long units=sold.stream().mapToLong(OrderItem::getQuantity).sum();
        Set<Long> orderIds=sold.stream().map(i->i.getOrder().getId()).collect(Collectors.toSet());long count=orderIds.size();BigDecimal average=count==0?BigDecimal.ZERO:revenue.divide(BigDecimal.valueOf(count),2,RoundingMode.HALF_UP);
        List<Product> filtered=products.findAll().stream().filter(p->matches(p,categoryId,language,authorId,publisherId)).toList();long totalStock=filtered.stream().mapToLong(p->inventory.currentStock(p.getId())).sum();
        BigDecimal value=filtered.stream().filter(p->p.getPurchaseCost()!=null).map(p->p.getPurchaseCost().multiply(BigDecimal.valueOf(Math.max(0,inventory.currentStock(p.getId()))))).reduce(BigDecimal.ZERO,BigDecimal::add);
        long low=filtered.stream().filter(Product::isActive).filter(p->{int s=inventory.currentStock(p.getId());return s>0&&s<=p.getMinimumStockThreshold();}).count();long out=filtered.stream().filter(Product::isActive).filter(p->inventory.currentStock(p.getId())<=0).count();
        Map<Product,long[]> totals=new HashMap<>();Map<Product,BigDecimal> revs=new HashMap<>();for(OrderItem i:sold){totals.computeIfAbsent(i.getProduct(),p->new long[1])[0]+=i.getQuantity();revs.merge(i.getProduct(),i.getLineTotal(),BigDecimal::add);}
        List<ProductMetric> best=totals.entrySet().stream().sorted((a,b)->Long.compare(b.getValue()[0],a.getValue()[0])).limit(10).map(e->metric(e.getKey(),e.getValue()[0],revs.get(e.getKey()))).toList();
        List<ProductMetric> slow=filtered.stream().filter(p->inventory.currentStock(p.getId())>0).sorted(Comparator.comparingLong(p->totals.getOrDefault(p,new long[1])[0])).limit(10).map(p->metric(p,totals.getOrDefault(p,new long[1])[0],revs.getOrDefault(p,BigDecimal.ZERO))).toList();
        List<MetricPoint> categories=aggregateUnits(sold,p->p.getCategory()==null?"Sans catégorie":p.getCategory().getName());List<MetricPoint> languages=aggregateUnits(sold,Product::getLanguage);
        Map<LocalDate,List<OrderItem>> byDay=sold.stream().collect(Collectors.groupingBy(i->i.getOrder().getOrderDate().atZone(zone).toLocalDate(),TreeMap::new,Collectors.toList()));List<TrendPoint> trend=byDay.entrySet().stream().map(e->new TrendPoint(e.getKey(),e.getValue().stream().map(OrderItem::getLineTotal).reduce(BigDecimal.ZERO,BigDecimal::add),e.getValue().stream().map(i->i.getOrder().getId()).distinct().count(),e.getValue().stream().mapToLong(OrderItem::getQuantity).sum())).toList();
        BigDecimal cogs=sold.stream().filter(i->i.getProduct().getPurchaseCost()!=null).map(i->i.getProduct().getPurchaseCost().multiply(BigDecimal.valueOf(i.getQuantity()))).reduce(BigDecimal.ZERO,BigDecimal::add);BigDecimal turnover=value.signum()==0?null:cogs.divide(value,4,RoundingMode.HALF_UP);
        long days=Math.max(1,Duration.between(start,end).toDays()+1);BigDecimal daily=BigDecimal.valueOf(units).divide(BigDecimal.valueOf(days),6,RoundingMode.HALF_UP);BigDecimal remaining=daily.signum()==0?null:BigDecimal.valueOf(totalStock).divide(daily,2,RoundingMode.HALF_UP);
        // The public date bounds are inclusive; one nanosecond converts to a half-open interval.
        Duration duration=Duration.between(start,end).plusNanos(1);
        Instant previousStart=start.minus(duration);
        List<OrderItem> previous=items.soldInPeriod(previousStart,start).stream()
                .filter(i->matches(i.getProduct(),categoryId,language,authorId,publisherId)).toList();
        BigDecimal previousRevenue=previous.stream().map(OrderItem::getLineTotal).reduce(BigDecimal.ZERO,BigDecimal::add);
        long previousCount=previous.stream().map(i->i.getOrder().getId()).distinct().count();
        long previousUnits=previous.stream().mapToLong(OrderItem::getQuantity).sum();
        BigDecimal previousAverage=previousCount==0?BigDecimal.ZERO:previousRevenue.divide(BigDecimal.valueOf(previousCount),2,RoundingMode.HALF_UP);
        var comparison=new PeriodComparison(previousStart,start.minusNanos(1),Map.of(
                "totalRevenue",compare(revenue,previousRevenue),
                "numberOfOrders",compare(BigDecimal.valueOf(count),BigDecimal.valueOf(previousCount)),
                "unitsSold",compare(BigDecimal.valueOf(units),BigDecimal.valueOf(previousUnits)),
                "averageOrderValue",compare(average,previousAverage)));
        return new DashboardResponse(revenue,count,units,average,totalStock,value,low,out,turnover,remaining,best,slow,categories,languages,trend,comparison);
    }
    static ComparisonMetric compare(BigDecimal current,BigDecimal previous) {
        if(previous==null)return new ComparisonMetric(null,null,null);
        BigDecimal change=current.subtract(previous);
        return new ComparisonMetric(previous,change,previous.signum()==0?null:change.multiply(BigDecimal.valueOf(100)).divide(previous.abs(),2,RoundingMode.HALF_UP));
    }
    private boolean matches(Product p,Long category,String language,Long author,Long publisher){return(category==null||(p.getCategory()!=null&&category.equals(p.getCategory().getId())))&&(language==null||language.isBlank()||language.equalsIgnoreCase(p.getLanguage()))&&(publisher==null||(p.getPublisher()!=null&&publisher.equals(p.getPublisher().getId())))&&(author==null||p.getAuthors().stream().anyMatch(a->author.equals(a.getId())));}
    private ProductMetric metric(Product p,long units,BigDecimal revenue){return new ProductMetric(p.getId(),p.getSku(),p.getTitle(),imageUrl(p),units,revenue,inventory.currentStock(p.getId()));}
    private List<MetricPoint> aggregateUnits(List<OrderItem> sold,Function<Product,String> key){return sold.stream().collect(Collectors.groupingBy(i->key.apply(i.getProduct()),Collectors.summingLong(OrderItem::getQuantity))).entrySet().stream().sorted(Map.Entry.<String,Long>comparingByValue().reversed()).map(e->new MetricPoint(e.getKey(),BigDecimal.valueOf(e.getValue()))).toList();}
    private String imageUrl(Product p){return p.getImageKey()==null?null:"/api/products/"+p.getId()+"/image";}
}
