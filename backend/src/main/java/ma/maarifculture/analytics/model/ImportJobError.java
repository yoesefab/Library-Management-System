package ma.maarifculture.analytics.model;

import jakarta.persistence.*;

@Entity @Table(name="import_job_error")
public class ImportJobError {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="import_job_id") private ImportJob importJob;
    @Column(name="row_number",nullable=false) private int rowNumber;
    @Column(name="field_name",length=100) private String fieldName;
    @Column(name="error_code",nullable=false,length=80) private String errorCode;
    @Column(nullable=false,length=1000) private String message;
    @Column(name="rejected_value",length=500) private String rejectedValue;
    protected ImportJobError() {}
    ImportJobError(ImportJob job,int row,String field,String code,String message,String rejected){importJob=job;rowNumber=row;fieldName=field;errorCode=code;this.message=message;rejectedValue=rejected;}
    public Long getId(){return id;} public int getRowNumber(){return rowNumber;} public String getFieldName(){return fieldName;} public String getErrorCode(){return errorCode;} public String getMessage(){return message;} public String getRejectedValue(){return rejectedValue;}
}
