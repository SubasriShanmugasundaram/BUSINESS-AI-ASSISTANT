package com.businessassistant.service;

import com.businessassistant.dto.*;
import com.businessassistant.entity.BusinessProfile;
import com.businessassistant.entity.User;
import com.businessassistant.exception.ResourceNotFoundException;
import com.businessassistant.repository.BusinessProfileRepository;
import com.businessassistant.repository.UserRepository;
import com.businessassistant.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       BusinessProfileRepository businessProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.businessProfileRepository = businessProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "ROLE_OWNER"
        );
        user = userRepository.save(user);

        // Ensure BusinessProfile exists or is updated with registered store name
        BusinessProfile profile = businessProfileRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> new BusinessProfile(
                        request.getBusinessName() != null ? request.getBusinessName() : "Lakshmi Enterprise",
                        "Wholesale & Retail Commercial Trading",
                        request.getPhone() != null ? request.getPhone() : "+91 9876543210",
                        request.getEmail(),
                        "29ABCDE1234F1Z5",
                        "102 Market Road, Bengaluru - 560001"
                ));
        if (request.getBusinessName() != null && !request.getBusinessName().isBlank()) {
            profile.setBusinessName(request.getBusinessName());
        }
        profile = businessProfileRepository.save(profile);

        String jwt = jwtUtils.generateTokenFromUsername(user.getEmail());

        BusinessProfileDTO profileDTO = toProfileDTO(profile);
        return new JwtResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole(), profileDTO);
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        BusinessProfile profile = businessProfileRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> businessProfileRepository.save(new BusinessProfile(
                        "Lakshmi Enterprise",
                        "Wholesale & Retail Commercial Trading",
                        "+91 9876543210",
                        user.getEmail(),
                        "29ABCDE1234F1Z5",
                        "102 Market Road, Bengaluru - 560001"
                )));

        return new JwtResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole(), toProfileDTO(profile));
    }

    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }

    private BusinessProfileDTO toProfileDTO(BusinessProfile profile) {
        if (profile == null) return null;
        return new BusinessProfileDTO(
                profile.getId(),
                profile.getBusinessName(),
                profile.getTagline(),
                profile.getPhone(),
                profile.getEmail(),
                profile.getGstin(),
                profile.getAddress(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
