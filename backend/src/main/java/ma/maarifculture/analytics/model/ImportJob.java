package ma.maarifculture.analytics.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name="import_job")
public class ImportJob {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="file_name",nullable=false) private String fileName;
    @Column(name="file_checksum",nullable=false,length=64) private String fileChecksum;
    @Enumerated(EnumType.STRING) @Column(name="import_type",nullable=false,length=30) private ImportType importType;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private ImportStatus status;
    @Column(name="total_rows",nullable=false) private int totalRows;
    @Column(name="successful_rows",nullable=false) private int successfulRows;
    @Column(name="failed_rows",nullable=false) private int failedRows;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id") private AppUser user;
    @Column(name="started_at",nullable=false,updatable=false) private Instant startedAt;
    @Column(name="completed_at") private Instant completedAt;
    @Column(name="error_report_location",length=500) private String errorReportLocation;
    @Column(columnDefinition="text") private String payload;
    @OneToMany(mappedBy="importJob",cascade=CascadeType.ALL,orphanRemoval=true) private List<ImportJobError> errors=new ArrayList<>();
    protected ImportJob() {}
    public ImportJob(String name,String checksum,AppUser user,String payload){fileName=name;fileChecksum=checksum;this.user=user;this.payload=payload;importType=ImportType.SALES_CSV;status=ImportStatus.VALIDATING;startedAt=Instant.now();}
    public void validationComplete(int total,int failed){totalRows=total;failedRows=failed;successfulRows=total-failed;status=failed==0?ImportStatus.READY:ImportStatus.PARTIAL;}
    public void addError(int row,String field,String code,String message,String rejected){errors.add(new ImportJobError(this,row,field,code,message,rejected));}
    public void processing(){status=ImportStatus.PROCESSING;}
    public void completed(){status=ImportStatus.COMPLETED;successfulRows=totalRows;failedRows=0;completedAt=Instant.now();payload=null;}
    public Long getId(){return id;} public String getFileName(){return fileName;} public String getFileChecksum(){return fileChecksum;} public ImportType getImportType(){return importType;}
    public ImportStatus getStatus(){return status;} public int getTotalRows(){return totalRows;} public int getSuccessfulRows(){return successfulRows;} public int getFailedRows(){return failedRows;}
    public AppUser getUser(){return user;} public Instant getStartedAt(){return startedAt;} public Instant getCompletedAt(){return completedAt;} public String getPayload(){return payload;} public List<ImportJobError> getErrors(){return errors;}
}
