package ma.maarifculture.analytics.repository;

import java.util.Optional;
import ma.maarifculture.analytics.model.UserRole;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ma.maarifculture.analytics.model.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    Page<AppUser> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email, Pageable pageable);
    @Query("""
            select u from AppUser u
            where (lower(u.fullName) like lower(concat('%', :query, '%'))
                or lower(u.email) like lower(concat('%', :query, '%')))
            and (:role is null or u.role = :role)
            and (:active is null or u.active = :active)
            """)
    Page<AppUser> search(@Param("query") String query, @Param("role") UserRole role,
            @Param("active") Boolean active, Pageable pageable);
}
