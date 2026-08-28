package ma.maarifculture.analytics.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import ma.maarifculture.analytics.dto.OrderDtos.*;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.model.OrderStatus;
import ma.maarifculture.analytics.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/orders")
@PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
public class OrderController {
    private final OrderService service;public OrderController(OrderService service){this.service=service;}
    @GetMapping public PageResponse<OrderResponse> list(@RequestParam(required=false) OrderStatus status,@RequestParam(defaultValue="0") @Min(0) int page,@RequestParam(defaultValue="20") @Min(1) @Max(100) int size){return service.list(status,page,size);}
    @GetMapping("/{id}") public OrderResponse get(@PathVariable Long id){return service.get(id);}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public OrderResponse create(@Valid @RequestBody CreateRequest request){return service.createManual(request);}
    @PatchMapping("/{id}/status") public OrderResponse status(@PathVariable Long id,@Valid @RequestBody StatusRequest request){return service.changeStatus(id,request.status());}
}
