package com.vistajet.vistajet.about;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "https://customshangarservices.vercel.app/")
@RequestMapping("/api/v1/about")
public class AboutController {

    private final AboutService service;

    @PostMapping(value = "/add-about")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addAbout(
            @RequestBody @Valid AboutRequest request) {
        service.createAbout(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("About saved successfully");
    }

    @GetMapping("/all-about")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<List<AboutResponse>> getAllAbout() {
        return ResponseEntity.ok(service.getAllAbout());
    }

    @PutMapping(value = "/update/{id}")
    @PreAuthorize("isAuthenticated()")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> updateAbout(@PathVariable("id") Integer id,
                                         @RequestBody AboutRequest request){
        service.updateAbout(id, request);
        return ResponseEntity.ok("About updated successfully");
    }


}

