package com.businessassistant.service;

import com.businessassistant.dto.BusinessProfileDTO;
import com.businessassistant.entity.BusinessProfile;
import com.businessassistant.repository.BusinessProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BusinessProfileService {

    private final BusinessProfileRepository businessProfileRepository;

    public BusinessProfileService(BusinessProfileRepository businessProfileRepository) {
        this.businessProfileRepository = businessProfileRepository;
    }

    public BusinessProfileDTO getProfile() {
        BusinessProfile profile = businessProfileRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> businessProfileRepository.save(new BusinessProfile(
                        "Lakshmi Enterprise",
                        "Wholesale & Retail Commercial Trading",
                        "+91 9876543210",
                        "contact@lakshmi.in",
                        "29ABCDE1234F1Z5",
                        "102 Market Road, Bengaluru - 560001"
                )));
        return toDTO(profile);
    }

    @Transactional
    public BusinessProfileDTO updateProfile(BusinessProfileDTO dto) {
        BusinessProfile profile = businessProfileRepository.findFirstByOrderByIdAsc()
                .orElseGet(BusinessProfile::new);

        if (dto.getBusinessName() != null && !dto.getBusinessName().isBlank()) {
            profile.setBusinessName(dto.getBusinessName());
        }
        if (dto.getTagline() != null) profile.setTagline(dto.getTagline());
        if (dto.getPhone() != null) profile.setPhone(dto.getPhone());
        if (dto.getEmail() != null) profile.setEmail(dto.getEmail());
        if (dto.getGstin() != null) profile.setGstin(dto.getGstin());
        if (dto.getAddress() != null) profile.setAddress(dto.getAddress());

        profile = businessProfileRepository.save(profile);
        return toDTO(profile);
    }

    private BusinessProfileDTO toDTO(BusinessProfile p) {
        return new BusinessProfileDTO(
                p.getId(),
                p.getBusinessName(),
                p.getTagline(),
                p.getPhone(),
                p.getEmail(),
                p.getGstin(),
                p.getAddress(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
