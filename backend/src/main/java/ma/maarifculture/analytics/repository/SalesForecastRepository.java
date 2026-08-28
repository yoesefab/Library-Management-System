package ma.maarifculture.analytics.repository;
import java.util.Optional;
import ma.maarifculture.analytics.model.SalesForecast;
import org.springframework.data.domain.Page;import org.springframework.data.domain.Pageable;import org.springframework.data.jpa.repository.JpaRepository;
public interface SalesForecastRepository extends JpaRepository<SalesForecast,Long>{Optional<SalesForecast> findFirstByProductIdOrderByGeneratedAtDesc(Long productId);Page<SalesForecast> findByProductId(Long productId,Pageable pageable);}
