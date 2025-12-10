package com.vistajet.vistajet.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/service")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class ServiceController {

    private final MyServices service;

    @PostMapping(value = "/add-service", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addService(
            @RequestPart("data") @Valid ServiceRequest request,
            @RequestPart("file") MultipartFile file) {
        service.createService(request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Service saved successfully");
    }


    @GetMapping("/all-service")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<List<ServiceResponse>> getAllService(){
        return ResponseEntity.ok(service.getAllService());
    }
    @GetMapping("/find")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<ServiceResponse> getAService(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String title
    ) {
        return ResponseEntity.ok(service.getAService(id, title));
    }

    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestPart("data") @Valid ServiceRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        service.updateService(id, request, file);
        return ResponseEntity.ok("Service updated successfully");
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        service.deleteService(id);
        return ResponseEntity.ok("Service removed successfully");
    }
}
