package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity @Table(name="sales_order", uniqueConstraints=@UniqueConstraint(name="uk_sales_order_source_reference",columnNames={"source","external_reference"}))
public class SalesOrder {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="external_reference",nullable=false,length=120) private String externalReference;
    @Column(name="order_date",nullable=false) private Instant orderDate;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private OrderStatus status;
    @Column(name="customer_city",length=120) private String customerCity;
    @Column(name="total_amount",nullable=false,precision=19,scale=2) private BigDecimal totalAmount=BigDecimal.ZERO;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private OrderSource source;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt;
    @Column(name="updated_at",nullable=false) private Instant updatedAt;
    @OneToMany(mappedBy="order",cascade=CascadeType.ALL,orphanRemoval=true) private List<OrderItem> items=new ArrayList<>();
    protected SalesOrder() {}
    public SalesOrder(String reference,Instant date,OrderStatus status,String city,OrderSource source){externalReference=reference.trim();orderDate=date;this.status=status;customerCity=city==null?null:city.trim();this.source=source;}
    @PrePersist void created(){createdAt=updatedAt=Instant.now();}
    @PreUpdate void updated(){updatedAt=Instant.now();}
    public void addItem(Product product,int quantity,BigDecimal unitPrice,BigDecimal discount){OrderItem item=new OrderItem(this,product,quantity,unitPrice,discount);items.add(item);recalculate();}
    public void changeStatus(OrderStatus status){this.status=status;}
    private void recalculate(){totalAmount=items.stream().map(OrderItem::getLineTotal).reduce(BigDecimal.ZERO,BigDecimal::add);}
    public Long getId(){return id;} public String getExternalReference(){return externalReference;} public Instant getOrderDate(){return orderDate;}
    public OrderStatus getStatus(){return status;} public String getCustomerCity(){return customerCity;} public BigDecimal getTotalAmount(){return totalAmount;}
    public OrderSource getSource(){return source;} public Instant getCreatedAt(){return createdAt;} public List<OrderItem> getItems(){return Collections.unmodifiableList(items);}
}
