package ma.maarifculture.analytics.controller;

import jakarta.validation.Valid;
import ma.maarifculture.analytics.model.UserRole;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import ma.maarifculture.analytics.dto.AuthDtos.UserRequest;
import ma.maarifculture.analytics.dto.AuthDtos.UserResponse;
import ma.maarifculture.analytics.dto.AuditLogResponse;
import ma.maarifculture.analytics.dto.PageResponse;
import ma.maarifculture.analytics.service.UserAdministrationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMINISTRATOR')")
@Validated
public class AdministrationController {
    private final UserAdministrationService service;
    public AdministrationController(UserAdministrationService service) { this.service = service; }

    @GetMapping("/users") public PageResponse<UserResponse> users(@RequestParam(defaultValue="") @Size(max=254) String query,
            @RequestParam(defaultValue="0") @Min(0) int page, @RequestParam(defaultValue="20") @Min(1) @Max(100) int size,
            @RequestParam(required=false) UserRole role, @RequestParam(required=false) Boolean active,
            @RequestParam(defaultValue="fullName") String sortBy, @RequestParam(defaultValue="asc") String direction) {
        return service.list(query, page, size, role, active, sortBy, direction);
    }
    @PostMapping("/users") @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody UserRequest request) { return service.create(request); }
    @PutMapping("/users/{id}") public UserResponse update(@PathVariable @Positive Long id, @Valid @RequestBody UserRequest request) { return service.update(id, request); }
    @GetMapping("/audit-logs") public PageResponse<AuditLogResponse> logs(@RequestParam(defaultValue="0") @Min(0) int page,
            @RequestParam(defaultValue="20") @Min(1) @Max(100) int size) { return service.auditLogs(page, size); }
}
