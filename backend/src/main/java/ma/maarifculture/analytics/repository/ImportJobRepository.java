package ma.maarifculture.analytics.repository;
import java.util.Optional;
import ma.maarifculture.analytics.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
public interface ImportJobRepository extends JpaRepository<ImportJob,Long>{
    Optional<ImportJob> findByImportTypeAndFileChecksum(ImportType type,String checksum);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select job from ImportJob job where job.id = :id")
    Optional<ImportJob> findLockedById(@Param("id") Long id);
}
