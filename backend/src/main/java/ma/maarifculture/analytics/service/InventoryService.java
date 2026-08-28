package ma.maarifculture.analytics.service;

import ma.maarifculture.analytics.dto.InventoryDtos.*;
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
public class InventoryService {
    private final InventoryMovementRepository movements; private final ProductRepository products;
    private final CurrentUserService currentUser; private final AuditService audit;
    public InventoryService(InventoryMovementRepository movements, ProductRepository products, CurrentUserService currentUser, AuditService audit){
        this.movements=movements;this.products=products;this.currentUser=currentUser;this.audit=audit;
    }
    public int currentStock(Long productId){return Math.toIntExact(movements.currentStock(productId));}
    public PageResponse<StockResponse> inventory(int page,int size){return PageResponse.from(products.findAll(PageRequest.of(page,size,Sort.by("title")))
            .map(p->new StockResponse(p.getId(),p.getSku(),p.getTitle(),currentStock(p.getId()),p.getMinimumStockThreshold(),p.isActive())));}
    public PageResponse<MovementResponse> history(Long productId,int page,int size){
        products.findById(productId).orElseThrow(()->new ResourceNotFoundException("Produit introuvable : "+productId));
        return PageResponse.from(movements.findByProductId(productId,PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,"occurredAt"))).map(this::response));
    }
    @Transactional
    public MovementResponse record(MovementRequest request){
        Product product=products.findById(request.productId()).orElseThrow(()->new ResourceNotFoundException("Produit introuvable : "+request.productId()));
        AppUser actor=currentUser.required(); validateDirection(request.type(),request.quantity());
        int resulting=Math.addExact(currentStock(product.getId()),request.quantity());
        if(resulting<0 && !(request.type()==InventoryMovementType.CORRECTION && actor.getRole()==UserRole.ADMINISTRATOR))
            throw new ConflictException("Le stock ne peut pas devenir négatif. Seule une correction administrateur motivée est autorisée.");
        InventoryMovement saved=movements.save(new InventoryMovement(product,request.type(),request.quantity(),request.reason(),null,actor));
        audit.record(actor,"INVENTORY_MOVEMENT_CREATED","InventoryMovement",saved.getId(),"type="+request.type()+",quantity="+request.quantity());
        return response(saved,resulting);
    }
    @Transactional
    public void applyOrder(Product product, SalesOrder order, int signedQuantity, InventoryMovementType type, AppUser actor, String reason){
        if(movements.existsByRelatedOrderIdAndProductIdAndMovementType(order.getId(),product.getId(),type)) return;
        int resulting=Math.addExact(currentStock(product.getId()),signedQuantity);
        if(resulting<0) throw new ConflictException("Stock insuffisant pour "+product.getSku()+".");
        movements.save(new InventoryMovement(product,type,signedQuantity,reason,order,actor));
    }
    private void validateDirection(InventoryMovementType type,int quantity){
        if(quantity==0) throw new IllegalArgumentException("La quantité ne peut pas être nulle.");
        boolean positive=type==InventoryMovementType.INITIAL_STOCK||type==InventoryMovementType.PURCHASE||type==InventoryMovementType.CUSTOMER_RETURN;
        boolean negative=type==InventoryMovementType.SALE||type==InventoryMovementType.SUPPLIER_RETURN||type==InventoryMovementType.DAMAGE;
        if((positive&&quantity<0)||(negative&&quantity>0)) throw new IllegalArgumentException("Le signe de la quantité ne correspond pas au type de mouvement.");
    }
    private MovementResponse response(InventoryMovement m){return response(m,currentStock(m.getProduct().getId()));}
    private MovementResponse response(InventoryMovement m,int stock){return new MovementResponse(m.getId(),m.getProduct().getId(),m.getProduct().getSku(),m.getProduct().getTitle(),m.getMovementType(),m.getQuantity(),stock,m.getReason(),m.getRelatedOrder()==null?null:m.getRelatedOrder().getId(),m.getCreatedBy().getEmail(),m.getOccurredAt());}
}
