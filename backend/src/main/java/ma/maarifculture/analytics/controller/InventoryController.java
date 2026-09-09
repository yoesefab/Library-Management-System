package ma.maarifculture.analytics.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import ma.maarifculture.analytics.dto.InventoryDtos.*;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/inventory")
@PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','STOCK_EMPLOYEE')")
public class InventoryController {
    private final InventoryService service;public InventoryController(InventoryService service){this.service=service;}
    @GetMapping public PageResponse<StockResponse> inventory(@RequestParam(defaultValue="0") @Min(0) int page,@RequestParam(defaultValue="20") @Min(1) @Max(100) int size){return service.inventory(page,size);}
    @GetMapping("/products/{productId}/movements") public PageResponse<MovementResponse> history(@PathVariable @jakarta.validation.constraints.Positive Long productId,@RequestParam(defaultValue="0") @Min(0) int page,@RequestParam(defaultValue="20") @Min(1) @Max(100) int size){return service.history(productId,page,size);}
    @PostMapping("/movements") @ResponseStatus(HttpStatus.CREATED) public MovementResponse record(@Valid @RequestBody MovementRequest request){return service.record(request);}
}
