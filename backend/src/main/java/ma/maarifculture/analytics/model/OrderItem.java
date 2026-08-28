package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity @Table(name="order_item")
public class OrderItem {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="order_id") private SalesOrder order;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="product_id") private Product product;
    @Column(nullable=false) private int quantity;
    @Column(name="unit_price",nullable=false,precision=19,scale=2) private BigDecimal unitPrice;
    @Column(nullable=false,precision=19,scale=2) private BigDecimal discount;
    @Column(name="line_total",nullable=false,precision=19,scale=2) private BigDecimal lineTotal;
    protected OrderItem() {}
    OrderItem(SalesOrder order,Product product,int quantity,BigDecimal unitPrice,BigDecimal discount){
        if(quantity<=0)throw new IllegalArgumentException("La quantité doit être positive.");
        BigDecimal gross=unitPrice.multiply(BigDecimal.valueOf(quantity));
        if(unitPrice.signum()<0||discount.signum()<0||discount.compareTo(gross)>0)throw new IllegalArgumentException("Prix ou remise invalide.");
        this.order=order;this.product=product;this.quantity=quantity;this.unitPrice=unitPrice.setScale(2,RoundingMode.HALF_UP);this.discount=discount.setScale(2,RoundingMode.HALF_UP);this.lineTotal=gross.subtract(discount).setScale(2,RoundingMode.HALF_UP);
    }
    public Long getId(){return id;} public SalesOrder getOrder(){return order;} public Product getProduct(){return product;} public int getQuantity(){return quantity;}
    public BigDecimal getUnitPrice(){return unitPrice;} public BigDecimal getDiscount(){return discount;} public BigDecimal getLineTotal(){return lineTotal;}
}
