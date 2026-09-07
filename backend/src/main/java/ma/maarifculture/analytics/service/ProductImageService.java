package ma.maarifculture.analytics.service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import ma.maarifculture.analytics.dto.ProductDetailResponse;
import ma.maarifculture.analytics.exception.ResourceNotFoundException;
import ma.maarifculture.analytics.mapper.ProductMapper;
import ma.maarifculture.analytics.model.Product;
import ma.maarifculture.analytics.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductImageService {
    public static final long MAX_BYTES = 5L * 1024 * 1024;
    private static final Map<String, MediaType> TYPES = Map.of(
            "jpg", MediaType.IMAGE_JPEG, "png", MediaType.IMAGE_PNG, "webp", MediaType.parseMediaType("image/webp"));
    private final Path root;
    private final ProductRepository products;
    private final ProductMapper mapper;

    public ProductImageService(@Value("${maarif.images.directory}") String directory, ProductRepository products, ProductMapper mapper) {
        this.root = Path.of(directory).toAbsolutePath().normalize(); this.products = products; this.mapper = mapper;
    }

    @PostConstruct void initialize() { try { Files.createDirectories(root); } catch (IOException e) { throw new IllegalStateException("Impossible d’initialiser le stockage des images.", e); } }

    @Transactional
    public ProductDetailResponse store(Long id, MultipartFile file) {
        Product product = required(id); ValidatedImage image = validate(file);
        String key = UUID.randomUUID() + "." + image.extension(); Path destination = resolve(key);
        try { Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING); }
        catch (IOException e) { throw new IllegalStateException("Impossible d’enregistrer l’image du produit.", e); }
        String oldKey = product.getImageKey(); product.setImageKey(key); products.saveAndFlush(product); deleteQuietly(oldKey);
        return mapper.toDetail(product);
    }

    @Transactional
    public ProductDetailResponse remove(Long id) { Product product=required(id); String old=product.getImageKey(); product.setImageKey(null); products.saveAndFlush(product); deleteQuietly(old); return mapper.toDetail(product); }

    public StoredImage load(Long id) {
        Product product=required(id); if(product.getImageKey()==null) throw new ResourceNotFoundException("Ce produit ne possède pas d’image.");
        try { Path path=resolve(product.getImageKey()); Resource resource=new UrlResource(path.toUri()); if(!resource.isReadable()) throw new ResourceNotFoundException("L’image du produit est indisponible."); return new StoredImage(resource, TYPES.get(extension(product.getImageKey()))); }
        catch (java.net.MalformedURLException e) { throw new ResourceNotFoundException("L’image du produit est indisponible."); }
    }

    private ValidatedImage validate(MultipartFile file) {
        if(file==null||file.isEmpty()) throw new IllegalArgumentException("Sélectionnez une image JPG, PNG ou WebP.");
        if(file.getSize()>MAX_BYTES) throw new IllegalArgumentException("L’image ne doit pas dépasser 5 Mo.");
        byte[] head; try { head=file.getInputStream().readNBytes(16); } catch(IOException e){ throw new IllegalArgumentException("Le fichier image est illisible."); }
        String ext=detect(head); if(ext==null) throw new IllegalArgumentException("Format non autorisé. Utilisez une image JPG, PNG ou WebP valide.");
        String declared=file.getContentType()==null?"":file.getContentType().toLowerCase(Locale.ROOT);
        if(!declared.equals(TYPES.get(ext).toString())) throw new IllegalArgumentException("Le contenu du fichier ne correspond pas à son type d’image.");
        return new ValidatedImage(ext);
    }
    private String detect(byte[] b){ if(b.length>=3&&(b[0]&255)==0xff&&(b[1]&255)==0xd8&&(b[2]&255)==0xff)return "jpg"; if(b.length>=8&&(b[0]&255)==0x89&&b[1]==0x50&&b[2]==0x4e&&b[3]==0x47&&b[4]==0x0d&&b[5]==0x0a&&b[6]==0x1a&&b[7]==0x0a)return "png"; if(b.length>=12&&new String(b,0,4).equals("RIFF")&&new String(b,8,4).equals("WEBP"))return "webp"; return null; }
    private Product required(Long id){return products.findDetailedById(id).orElseThrow(()->new ResourceNotFoundException("Produit introuvable : "+id));}
    private Path resolve(String key){Path path=root.resolve(key).normalize();if(!path.getParent().equals(root))throw new IllegalArgumentException("Référence d’image invalide.");return path;}
    private String extension(String key){return key.substring(key.lastIndexOf('.')+1);}
    private void deleteQuietly(String key){if(key!=null)try{Files.deleteIfExists(resolve(key));}catch(IOException ignored){ /* cleanup can be retried operationally */ }}
    private record ValidatedImage(String extension) {}
    public record StoredImage(Resource resource, MediaType mediaType) {}
}
