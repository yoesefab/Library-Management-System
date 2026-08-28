package ma.maarifculture.analytics.repository;
import ma.maarifculture.analytics.model.*;import org.springframework.data.domain.*;import org.springframework.data.jpa.repository.JpaRepository;
public interface ReorderRecommendationRepository extends JpaRepository<ReorderRecommendation,Long>{Page<ReorderRecommendation> findByStatus(RecommendationStatus status,Pageable pageable);}
