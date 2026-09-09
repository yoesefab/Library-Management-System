package ma.maarifculture.analytics.service;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.security.MessageDigest;
import java.time.*;
import java.util.*;
import ma.maarifculture.analytics.dto.ImportDtos.*;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.dto.OrderDtos.*;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.model.*;
import ma.maarifculture.analytics.repository.*;
import org.apache.commons.csv.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service @Transactional(readOnly=true)
public class CsvImportService {
    private static final List<String> HEADERS=List.of("order_reference","order_date","product_sku","quantity","unit_price","discount","customer_city","order_status");
    private static final int MAX_ROWS = 10_000;
    private static final int MAX_FIELD_LENGTH = 500;
    private final ImportJobRepository jobs;private final ProductRepository products;private final OrderService orders;private final CurrentUserService currentUser;private final AuditService audit;private final ZoneId zone;
    public CsvImportService(ImportJobRepository jobs,ProductRepository products,OrderService orders,CurrentUserService currentUser,AuditService audit,@Value("${maarif.business-timezone}") String zone){this.jobs=jobs;this.products=products;this.orders=orders;this.currentUser=currentUser;this.audit=audit;this.zone=ZoneId.of(zone);}
    @Transactional
    public Preview preview(MultipartFile file) throws IOException {
        if(file.isEmpty())throw new IllegalArgumentException("Le fichier est vide.");
        validateCsvMetadata(file);
        byte[] bytes=file.getBytes();String checksum=sha256(bytes);var duplicate=jobs.findByImportTypeAndFileChecksum(ImportType.SALES_CSV,checksum);if(duplicate.isPresent())return response(duplicate.get());
        String payload=decodeUtf8(bytes);ImportJob job=jobs.save(new ImportJob(safeName(file.getOriginalFilename()),checksum,currentUser.required(),payload));
        int total=0;try(CSVParser parser=parse(payload)){Set<String> actual=parser.getHeaderMap().keySet();if(!actual.equals(new LinkedHashSet<>(HEADERS))){job.addError(1,"headers","INVALID_HEADERS","Les en-têtes doivent correspondre exactement au modèle attendu.",null);job.validationComplete(1,1);return response(job);}
            Map<String,String> orderHeaders=new HashMap<>();Set<String> orderProducts=new HashSet<>();
            for(CSVRecord row:parser){if(++total>MAX_ROWS)throw new IllegalArgumentException("Le fichier dépasse 10 000 lignes.");validateFieldLengths(row);validateRow(job,row);validateOrderStructure(job,row,orderHeaders,orderProducts);}
        }catch(IllegalArgumentException ex){job.addError(1,"file","INVALID_CSV",ex.getMessage(),null);job.validationComplete(Math.max(total,1),1);return response(job);}
        int failedRows=(int)job.getErrors().stream().map(ImportJobError::getRowNumber).distinct().count();job.validationComplete(total,failedRows);audit.record(job.getUser(),"IMPORT_PREVIEWED","ImportJob",job.getId(),"rows="+total+",failedRows="+failedRows+",errors="+job.getErrors().size());return response(job);
    }
    @Transactional
    public Preview confirm(Long id) throws IOException {
        ImportJob job=jobs.findLockedById(id).orElseThrow(()->new ResourceNotFoundException("Import introuvable : "+id));
        if(job.getStatus()==ImportStatus.COMPLETED)return response(job);if(job.getStatus()!=ImportStatus.READY)throw new ConflictException("L'import contient des erreurs ou n'est pas prêt.");job.processing();
        Map<String,List<CSVRecord>> grouped=new LinkedHashMap<>();try(CSVParser parser=parse(job.getPayload())){for(CSVRecord row:parser)grouped.computeIfAbsent(row.get("order_reference").trim(),key->new ArrayList<>()).add(row);}
        for(var entry:grouped.entrySet()){CSVRecord first=entry.getValue().getFirst();List<ItemRequest> itemRequests=new ArrayList<>();for(CSVRecord row:entry.getValue()){Product product=products.findBySku(row.get("product_sku").trim().toUpperCase(Locale.ROOT)).orElseThrow();itemRequests.add(new ItemRequest(product.getId(),Integer.parseInt(row.get("quantity").trim()),money(row,"unit_price"),money(row,"discount")));}
            orders.create(new CreateRequest(entry.getKey(),parseInstant(first.get("order_date")),OrderStatus.valueOf(first.get("order_status").trim().toUpperCase(Locale.ROOT)),blankToNull(first.get("customer_city")),itemRequests),OrderSource.CSV_IMPORT,job.getUser());}
        job.completed();audit.record(job.getUser(),"IMPORT_COMPLETED","ImportJob",job.getId(),"rows="+job.getTotalRows());return response(job);
    }
    public Preview get(Long id){return response(jobs.findById(id).orElseThrow(()->new ResourceNotFoundException("Import introuvable : "+id)));}
    public PageResponse<Preview> list(int page,int size){return PageResponse.from(jobs.findAll(PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,"startedAt"))).map(this::response));}
    public String errorCsv(Long id){ImportJob job=jobs.findById(id).orElseThrow(()->new ResourceNotFoundException("Import introuvable : "+id));StringBuilder out=new StringBuilder("row_number,field,error_code,message,rejected_value\n");for(ImportJobError e:job.getErrors())out.append(e.getRowNumber()).append(',').append(csv(e.getFieldName())).append(',').append(csv(e.getErrorCode())).append(',').append(csv(e.getMessage())).append(',').append(csv(e.getRejectedValue())).append('\n');return out.toString();}
    private CSVParser parse(String text)throws IOException{return CSVParser.parse(text,CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).setTrim(true).get());}
    private void validateCsvMetadata(MultipartFile file) {
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
        if (!name.endsWith(".csv")) throw new IllegalArgumentException("Le fichier doit utiliser l’extension .csv.");
        String type = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        if (!Set.of("text/csv", "text/plain", "application/csv", "application/vnd.ms-excel").contains(type))
            throw new IllegalArgumentException("Le type du fichier CSV n’est pas autorisé.");
    }
    private String decodeUtf8(byte[] bytes) {
        try { return StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT)
                .onUnmappableCharacter(CodingErrorAction.REPORT).decode(java.nio.ByteBuffer.wrap(bytes)).toString(); }
        catch (CharacterCodingException exception) { throw new IllegalArgumentException("Le fichier doit être encodé en UTF-8."); }
    }
    private void validateFieldLengths(CSVRecord row) {
        for (String header : HEADERS) if (row.get(header).length() > MAX_FIELD_LENGTH)
            throw new IllegalArgumentException("Une valeur CSV dépasse la longueur autorisée.");
    }
    private void validateRow(ImportJob job,CSVRecord row){int number=Math.toIntExact(row.getRecordNumber()+1);required(job,row,number,"order_reference");required(job,row,number,"product_sku");try{parseInstant(row.get("order_date"));}catch(Exception e){error(job,number,"order_date","INVALID_DATE","Date invalide.",row.get("order_date"));}try{if(Integer.parseInt(row.get("quantity"))<=0)throw new Exception();}catch(Exception e){error(job,number,"quantity","INVALID_QUANTITY","La quantité doit être positive.",row.get("quantity"));}try{int quantity=Integer.parseInt(row.get("quantity").trim());BigDecimal price=money(row,"unit_price"),discount=money(row,"discount");if(price.signum()<0||discount.signum()<0||quantity<=0||discount.compareTo(price.multiply(BigDecimal.valueOf(quantity)))>0)throw new Exception();}catch(Exception e){error(job,number,"price","INVALID_MONEY","Prix ou remise invalide.",null);}try{OrderStatus.valueOf(row.get("order_status").trim().toUpperCase(Locale.ROOT));}catch(Exception e){error(job,number,"order_status","INVALID_STATUS","Statut de commande invalide.",row.get("order_status"));}if(!row.get("product_sku").isBlank()&&products.findBySku(row.get("product_sku").trim().toUpperCase(Locale.ROOT)).isEmpty())error(job,number,"product_sku","UNKNOWN_SKU","SKU inconnu.",row.get("product_sku"));}
    private void validateOrderStructure(ImportJob job,CSVRecord row,Map<String,String> orderHeaders,Set<String> orderProducts){int number=Math.toIntExact(row.getRecordNumber()+1);String reference=row.get("order_reference").trim();String sku=row.get("product_sku").trim().toUpperCase(Locale.ROOT);if(reference.isBlank()||sku.isBlank())return;String signature=row.get("order_date").trim()+"|"+row.get("customer_city").trim()+"|"+row.get("order_status").trim().toUpperCase(Locale.ROOT);String previous=orderHeaders.putIfAbsent(reference,signature);if(previous!=null&&!previous.equals(signature))error(job,number,"order_reference","INCONSISTENT_ORDER","Les lignes d'une même commande doivent partager la date, la ville et le statut.",reference);if(!orderProducts.add(reference+"\u0000"+sku))error(job,number,"product_sku","DUPLICATE_ORDER_PRODUCT","Un produit ne peut apparaître qu'une fois dans une même commande.",sku);}
    private void required(ImportJob job,CSVRecord row,int n,String field){if(row.get(field).isBlank())error(job,n,field,"REQUIRED","Valeur obligatoire.",null);}private void error(ImportJob j,int n,String f,String c,String m,String v){j.addError(n,f,c,m,redact(v));}
    private Instant parseInstant(String value){String v=value.trim();try{return Instant.parse(v);}catch(Exception ignored){}try{return OffsetDateTime.parse(v).toInstant();}catch(Exception ignored){}return LocalDate.parse(v).atStartOfDay(zone).toInstant();}
    private BigDecimal money(CSVRecord r,String name){return new BigDecimal(r.get(name).trim()).setScale(2);}
    private String missing(Set<String> actual){return HEADERS.stream().filter(h->!actual.contains(h)).toList().toString();}
    private String sha256(byte[] bytes){try{return java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));}catch(Exception e){throw new IllegalStateException(e);}}
    private String safeName(String name){if(name==null)return "import.csv";return name.replaceAll("[^a-zA-Z0-9._-]","_");}
    private String redact(String value){if(value==null)return null;String safe=value.replaceAll("[\\p{Cntrl}]"," ");return safe.length()<=100?safe:safe.substring(0,100)+"…";}
    private String blankToNull(String s){return s==null||s.isBlank()?null:s.trim();}
    private String csv(String value){String safe=value==null?"":value;if(safe.startsWith("=")||safe.startsWith("+")||safe.startsWith("-")||safe.startsWith("@"))safe="'"+safe;return "\""+safe.replace("\"","\"\"")+"\"";}
    private Preview response(ImportJob j){return new Preview(j.getId(),j.getFileName(),j.getFileChecksum(),j.getStatus(),j.getTotalRows(),j.getSuccessfulRows(),j.getFailedRows(),j.getErrors().stream().map(e->new RowError(e.getRowNumber(),e.getFieldName(),e.getErrorCode(),e.getMessage(),e.getRejectedValue())).toList(),j.getStartedAt(),j.getCompletedAt());}
}
