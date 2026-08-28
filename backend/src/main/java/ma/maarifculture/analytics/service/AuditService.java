package ma.maarifculture.analytics.service;

import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.model.AuditLog;
import ma.maarifculture.analytics.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditLogRepository logs;
    public AuditService(AuditLogRepository logs) { this.logs = logs; }
    public void record(AppUser user, String action, String entityType, Object entityId, String metadata) {
        logs.save(new AuditLog(user, action, entityType, entityId == null ? null : entityId.toString(), metadata));
    }
}
