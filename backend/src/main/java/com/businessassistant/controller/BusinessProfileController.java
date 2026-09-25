package com.businessassistant.controller;

import com.businessassistant.dto.BusinessProfileDTO;
import com.businessassistant.service.BusinessProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business-profile")
@CrossOrigin(origins = "*")
public class BusinessProfileController {

    private final BusinessProfileService businessProfileService;

    public BusinessProfileController(BusinessProfileService businessProfileService) {
        this.businessProfileService = businessProfileService;
    }

    @GetMapping
    public ResponseEntity<BusinessProfileDTO> getProfile() {
        return ResponseEntity.ok(businessProfileService.getProfile());
    }

    @PostMapping
    public ResponseEntity<BusinessProfileDTO> createOrUpdateProfile(@Valid @RequestBody BusinessProfileDTO dto) {
        return ResponseEntity.ok(businessProfileService.updateProfile(dto));
    }

    @PutMapping
    public ResponseEntity<BusinessProfileDTO> updateProfile(@Valid @RequestBody BusinessProfileDTO dto) {
        return ResponseEntity.ok(businessProfileService.updateProfile(dto));
    }
}
