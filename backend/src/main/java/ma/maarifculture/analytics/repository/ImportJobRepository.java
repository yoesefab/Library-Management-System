package ma.maarifculture.analytics.repository;
import java.util.Optional;
import ma.maarifculture.analytics.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ImportJobRepository extends JpaRepository<ImportJob,Long>{Optional<ImportJob> findByImportTypeAndFileChecksum(ImportType type,String checksum);}
