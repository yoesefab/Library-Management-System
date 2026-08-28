package ma.maarifculture.analytics.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import ma.maarifculture.analytics.dto.InventoryDtos.AlertResponse;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.model.*;
import ma.maarifculture.analytics.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional(readOnly=true)
public class AlertService {
    private final StockAlertRepository alerts;private final ProductRepository products;private final InventoryService inventory;
    private final OrderItemRepository items;private final AppSettingRepository settings;private final CurrentUserService currentUser;private final AuditService audit;
    public AlertService(StockAlertRepository alerts,ProductRepository products,InventoryService inventory,OrderItemRepository items,AppSettingRepository settings,CurrentUserService currentUser,AuditService audit){this.alerts=alerts;this.products=products;this.inventory=inventory;this.items=items;this.settings=settings;this.currentUser=currentUser;this.audit=audit;}
    public PageResponse<AlertResponse> list(AlertStatus status,AlertType type,int page,int size){var pageable=PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,"createdAt"));Page<StockAlert> result=status!=null&&type!=null?alerts.findByStatusAndAlertType(status,type,pageable):status!=null?alerts.findByStatus(status,pageable):type!=null?alerts.findByAlertType(type,pageable):alerts.findAll(pageable);return PageResponse.from(result.map(this::response));}
    @Transactional public int refresh(){AppUser actor=currentUser.required();int created=0;for(Product p:products.findAll()){if(!p.isActive())continue;int stock=inventory.currentStock(p.getId());
        if(stock<=0)created+=open(p,AlertType.OUT_OF_STOCK,AlertSeverity.CRITICAL,"Le stock disponible est nul. Réapprovisionnement immédiat recommandé.");
        else if(stock<=p.getMinimumStockThreshold())created+=open(p,AlertType.LOW_STOCK,AlertSeverity.WARNING,"Stock actuel "+stock+" ≤ seuil minimal "+p.getMinimumStockThreshold()+".");
        if(stock>0){var sold=items.completedForProduct(p.getId());Instant last=sold.isEmpty()?p.getCreatedAt():sold.get(sold.size()-1).getOrder().getOrderDate();
            int dead=setting("inventory.dead_stock_days",180),slow=setting("inventory.slow_moving_days",90);long days=ChronoUnit.DAYS.between(last,Instant.now());if(days>=dead)created+=open(p,AlertType.DEAD_STOCK,AlertSeverity.WARNING,"Aucune vente récente détectée depuis au moins "+dead+" jours.");else if(days>=slow)created+=open(p,AlertType.SLOW_MOVING,AlertSeverity.INFO,"Rotation faible : aucune vente récente depuis au moins "+slow+" jours.");}
    }audit.record(actor,"ALERT_REFRESH","StockAlert",null,"created="+created);return created;}
    private int open(Product p,AlertType type,AlertSeverity severity,String explanation){if(alerts.findFirstByProductIdAndAlertTypeAndStatusNot(p.getId(),type,AlertStatus.RESOLVED).isPresent())return 0;alerts.save(new StockAlert(p,type,severity,explanation));return 1;}
    private int setting(String key,int fallback){return settings.findById(key).map(s->{try{return Integer.parseInt(s.getValue());}catch(Exception e){return fallback;}}).orElse(fallback);}
    @Transactional public AlertResponse acknowledge(Long id){StockAlert a=required(id);AppUser actor=currentUser.required();a.acknowledge(actor);audit.record(actor,"ALERT_ACKNOWLEDGED","StockAlert",id,null);return response(a);}
    @Transactional public AlertResponse resolve(Long id){StockAlert a=required(id);AppUser actor=currentUser.required();a.resolve(actor);audit.record(actor,"ALERT_RESOLVED","StockAlert",id,null);return response(a);}
    private StockAlert required(Long id){return alerts.findById(id).orElseThrow(()->new ResourceNotFoundException("Alerte introuvable : "+id));}
    private AlertResponse response(StockAlert a){Product p=a.getProduct();return new AlertResponse(a.getId(),p.getId(),p.getSku(),p.getTitle(),a.getAlertType(),a.getSeverity(),a.getExplanation(),a.getStatus(),a.getCreatedAt(),a.getAcknowledgedAt(),a.getResolvedAt());}
}
