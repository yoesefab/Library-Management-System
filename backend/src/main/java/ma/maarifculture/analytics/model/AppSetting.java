package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="app_setting")
public class AppSetting {
    @Id @Column(name="setting_key",length=120) private String key;
    @Column(name="setting_value",nullable=false,length=2000) private String value;
    @Column(length=500) private String description;
    @Column(name="updated_at",nullable=false) private Instant updatedAt;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="updated_by_user_id") private AppUser updatedBy;
    protected AppSetting() {}
    public void update(String value,String description,AppUser user){this.value=value;this.description=description;updatedBy=user;updatedAt=Instant.now();}
    public String getKey(){return key;} public String getValue(){return value;} public String getDescription(){return description;} public Instant getUpdatedAt(){return updatedAt;}
}
