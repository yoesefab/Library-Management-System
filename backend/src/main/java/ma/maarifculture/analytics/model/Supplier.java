package ma.maarifculture.analytics.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.Instant;

@Entity
@Table(name = "supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 180)
    @Column(nullable = false, unique = true, length = 180)
    private String name;

    @Size(max = 150)
    @Column(name = "contact_name", length = 150)
    private String contactName;

    @Email
    @Size(max = 254)
    @Column(length = 254)
    private String email;

    @Size(max = 40)
    @Column(length = 40)
    private String phone;

    @Size(max = 500)
    @Column(length = 500)
    private String address;

    @PositiveOrZero
    @Column(name = "default_lead_time_days", nullable = false)
    private int defaultLeadTimeDays;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Supplier() {
        // Required by JPA.
    }

    public Supplier(String name, int defaultLeadTimeDays) {
        this.name = CatalogValues.requiredText(name, "Supplier name");
        this.defaultLeadTimeDays = CatalogValues.nonNegative(defaultLeadTimeDays, "Default lead time");
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void updateContact(String contactName, String email, String phone, String address) {
        this.contactName = CatalogValues.optionalText(contactName);
        this.email = CatalogValues.optionalText(email);
        this.phone = CatalogValues.optionalText(phone);
        this.address = CatalogValues.optionalText(address);
    }

    public void deactivate() {
        active = false;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContactName() {
        return contactName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public int getDefaultLeadTimeDays() {
        return defaultLeadTimeDays;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
