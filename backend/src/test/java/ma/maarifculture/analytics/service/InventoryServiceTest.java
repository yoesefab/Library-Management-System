package ma.maarifculture.analytics.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;
import ma.maarifculture.analytics.dto.InventoryDtos.MovementRequest;
import ma.maarifculture.analytics.exception.ConflictException;
import ma.maarifculture.analytics.model.*;
import ma.maarifculture.analytics.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {
    @Mock InventoryMovementRepository movements;
    @Mock ProductRepository products;
    @Mock CurrentUserService current;
    @Mock AuditService audit;
    InventoryService service;
    Product product;

    @BeforeEach void setup(){service=new InventoryService(movements,products,current,audit);product=new Product("SKU-1","Livre test","fr",new BigDecimal("100"));when(products.findById(1L)).thenReturn(Optional.of(product));}

    @Test void refusesNegativeStockForStockEmployee(){when(current.required()).thenReturn(new AppUser("Stock","stock@test.local","hash",UserRole.STOCK_EMPLOYEE));when(movements.currentStock(null)).thenReturn(2L);assertThatThrownBy(()->service.record(new MovementRequest(1L,InventoryMovementType.DAMAGE,-3,"Livre endommagé"))).isInstanceOf(ConflictException.class);verify(movements,never()).save(any());}

    @Test void allowsReasonedAdministratorCorrectionBelowZero(){AppUser admin=new AppUser("Admin","admin@test.local","hash",UserRole.ADMINISTRATOR);when(current.required()).thenReturn(admin);when(movements.currentStock(null)).thenReturn(1L);when(movements.save(any())).thenAnswer(i->i.getArgument(0));var result=service.record(new MovementRequest(1L,InventoryMovementType.CORRECTION,-3,"Correction inventaire physique"));assertThat(result.resultingStock()).isEqualTo(-2);verify(movements).save(any());}
}
