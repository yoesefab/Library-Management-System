package ma.maarifculture.analytics.repository;

import ma.maarifculture.analytics.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
