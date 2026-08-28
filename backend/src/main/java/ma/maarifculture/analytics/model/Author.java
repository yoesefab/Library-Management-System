package ma.maarifculture.analytics.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "author")
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 180)
    @Column(nullable = false, unique = true, length = 180)
    private String name;

    protected Author() {
        // Required by JPA.
    }

    public Author(String name) {
        this.name = CatalogValues.requiredText(name, "Author name");
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void rename(String name) {
        this.name = CatalogValues.requiredText(name, "Author name");
    }
}
