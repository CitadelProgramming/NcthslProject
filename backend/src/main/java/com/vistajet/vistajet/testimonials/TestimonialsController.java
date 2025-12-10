package com.vistajet.vistajet.testimonials;

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
@RequestMapping("/api/v1/testimonials")
@CrossOrigin(origins = "https://customshangarservices.vercel.app/")
@Validated
public class TestimonialsController {

    private final TestimonialsService testimonialsService;

    @PostMapping(value = "/create-testimonials", consumes = "multipart/form-data")
    public ResponseEntity<?> createTestimonials(
            @RequestPart("data") @Valid TestimonialsRequest request,
            @RequestPart("file") MultipartFile file) {

       testimonialsService.createTestimonials(request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Testimonials created successfully");
    }

    @GetMapping("/all-testimonials")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<List<TestimonialsResponse>> getAllTestimonials() {
        return ResponseEntity.ok( testimonialsService.getAllTestimonials());
    }

    @GetMapping("/find")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<TestimonialsResponse> getAllTestimonials(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String fullName
    ) {
        return ResponseEntity.ok(testimonialsService.getATestimonials(id, fullName));
    }

    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> updateTestimonials(
            @PathVariable Integer id,
            @RequestPart("data") @Valid TestimonialsResponse request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

       testimonialsService.updateTestimonials(id, request, file);
        return ResponseEntity.ok("Testimonials updated successfully");
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> deleteTestimonials(@PathVariable Integer id) {
        testimonialsService.deleteTestimonials(id);
        return ResponseEntity.ok("Testimonials removed successfully");
    }
}
