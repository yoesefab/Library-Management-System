package ma.maarifculture.analytics.service;

import java.util.UUID;
import ma.maarifculture.analytics.dto.OrderDtos.*;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.model.*;
import ma.maarifculture.analytics.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional(readOnly=true)
public class OrderService {
    private final SalesOrderRepository orders; private final ProductRepository products; private final InventoryService inventory;
    private final CurrentUserService currentUser; private final AuditService audit;
    public OrderService(SalesOrderRepository orders,ProductRepository products,InventoryService inventory,CurrentUserService currentUser,AuditService audit){this.orders=orders;this.products=products;this.inventory=inventory;this.currentUser=currentUser;this.audit=audit;}
    public PageResponse<OrderResponse> list(OrderStatus status,int page,int size){var pageable=PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,"orderDate"));return PageResponse.from((status==null?orders.findAll(pageable):orders.findByStatus(status,pageable)).map(this::summary));}
    public OrderResponse get(Long id){return response(required(id));}
    @Transactional public OrderResponse createManual(CreateRequest request){return create(request,OrderSource.MANUAL,currentUser.required());}
    @Transactional
    public OrderResponse create(CreateRequest request,OrderSource source,AppUser actor){
        String ref=request.externalReference()==null||request.externalReference().isBlank()?"MAN-"+UUID.randomUUID():request.externalReference().trim();
        var existing=orders.findBySourceAndExternalReference(source,ref); if(existing.isPresent())return response(required(existing.get().getId()));
        SalesOrder order=new SalesOrder(ref,request.orderDate(),request.status(),request.customerCity(),source);
        for(ItemRequest item:request.items()){
            Product product=products.findById(item.productId()).orElseThrow(()->new ResourceNotFoundException("Produit introuvable : "+item.productId()));
            if(!product.isActive())throw new ConflictException("Le produit "+product.getSku()+" est désactivé.");
            order.addItem(product,item.quantity(),item.unitPrice(),item.discount());
        }
        order=orders.saveAndFlush(order);
        if(order.getStatus()==OrderStatus.COMPLETED)decreaseStock(order,actor);
        audit.record(actor,"ORDER_CREATED","SalesOrder",order.getId(),"source="+source+",reference="+ref);
        return response(order);
    }
    @Transactional
    public OrderResponse changeStatus(Long id,OrderStatus next){
        SalesOrder order=required(id);OrderStatus previous=order.getStatus();AppUser actor=currentUser.required();
        if(previous==next)return response(order);
        if(previous==OrderStatus.CANCELLED||previous==OrderStatus.REFUNDED)throw new ConflictException("Une commande annulée ou remboursée est terminale.");
        if(next==OrderStatus.COMPLETED)decreaseStock(order,actor);
        if(previous==OrderStatus.COMPLETED&&(next==OrderStatus.CANCELLED||next==OrderStatus.REFUNDED))restoreStock(order,actor);
        order.changeStatus(next);audit.record(actor,"ORDER_STATUS_CHANGED","SalesOrder",id,previous+"->"+next);return response(order);
    }
    private void decreaseStock(SalesOrder order,AppUser actor){for(OrderItem i:order.getItems())inventory.applyOrder(i.getProduct(),order,-i.getQuantity(),InventoryMovementType.SALE,actor,"Vente "+order.getExternalReference());}
    private void restoreStock(SalesOrder order,AppUser actor){for(OrderItem i:order.getItems())inventory.applyOrder(i.getProduct(),order,i.getQuantity(),InventoryMovementType.CUSTOMER_RETURN,actor,"Annulation/remboursement "+order.getExternalReference());}
    private SalesOrder required(Long id){return orders.findDetailedById(id).orElseThrow(()->new ResourceNotFoundException("Commande introuvable : "+id));}
    private OrderResponse summary(SalesOrder o){return new OrderResponse(o.getId(),o.getExternalReference(),o.getOrderDate(),o.getStatus(),o.getCustomerCity(),o.getTotalAmount(),o.getSource(),null,o.getCreatedAt());}
    private OrderResponse response(SalesOrder o){return new OrderResponse(o.getId(),o.getExternalReference(),o.getOrderDate(),o.getStatus(),o.getCustomerCity(),o.getTotalAmount(),o.getSource(),o.getItems().stream().map(i->new ItemResponse(i.getId(),i.getProduct().getId(),i.getProduct().getSku(),i.getProduct().getTitle(),i.getQuantity(),i.getUnitPrice(),i.getDiscount(),i.getLineTotal())).toList(),o.getCreatedAt());}
}
