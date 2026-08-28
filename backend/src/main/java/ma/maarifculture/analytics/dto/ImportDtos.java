package ma.maarifculture.analytics.dto;

import java.time.Instant;
import java.util.List;
import ma.maarifculture.analytics.model.ImportStatus;

public final class ImportDtos {
    private ImportDtos() {}
    public record RowError(int rowNumber,String field,String code,String message,String rejectedValue) {}
    public record Preview(Long id,String fileName,String checksum,ImportStatus status,int totalRows,int successfulRows,int failedRows,List<RowError> errors,Instant startedAt,Instant completedAt) {}
}
