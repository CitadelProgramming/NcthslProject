package com.vistajet.vistajet.partners;

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
@RequestMapping("/api/v1/partners")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class PartnerController {

    private final PartnerService partnerService;

    @PostMapping(value = "/create-partner", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPartner(
            @RequestPart("data") @Valid PartnerRequest request,
            @RequestPart("file") MultipartFile file) {

        partnerService.createPartner(request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Partner created successfully");
    }

    @GetMapping("/all-partners")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<List<PartnerResponse>> getAllPartners() {
        return ResponseEntity.ok(partnerService.getAllPartners());
    }

    @GetMapping("/find")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<PartnerResponse> getAPartner(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String companyName
    ) {
        return ResponseEntity.ok(partnerService.getAPartner(id, companyName));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> deletePartners(@PathVariable Integer id) {
        partnerService.deletePartners(id);
        return ResponseEntity.ok("Partner removed successfully");
    }

}
