package com.businessassistant.service;

import com.businessassistant.dto.JwtResponse;
import com.businessassistant.dto.LoginRequest;
import com.businessassistant.dto.RegisterRequest;
import com.businessassistant.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class AuthAndSecurityTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Auth: Register new business owner and verify JWT token issuance")
    void testRegisterAndLogin() {
        String testEmail = "owner_" + System.currentTimeMillis() + "@retailmsme.in";

        RegisterRequest reg = new RegisterRequest();
        reg.setEmail(testEmail);
        reg.setPassword("secretPassword123");
        reg.setName("Retail Owner");
        reg.setBusinessName("Shree Ganesh Supermarket");
        reg.setPhone("9988776655");

        JwtResponse regResponse = authService.register(reg);
        assertNotNull(regResponse);
        assertNotNull(regResponse.getToken());
        assertEquals(testEmail, regResponse.getEmail());
        assertEquals("ROLE_OWNER", regResponse.getRole());

        // Verify password is encrypted in database
        com.businessassistant.entity.User savedUser = userRepository.findByEmail(testEmail).orElseThrow();
        assertNotEquals("secretPassword123", savedUser.getPassword());
        assertTrue(savedUser.getPassword().startsWith("$2a$"), "Password should be BCrypt hashed");

        // Verify Login with BCrypt
        LoginRequest loginReq = new LoginRequest(testEmail, "secretPassword123");
        JwtResponse loginResponse = authService.login(loginReq);
        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertEquals(testEmail, loginResponse.getEmail());
    }

    @Test
    @DisplayName("Auth: Default seeded admin can log in successfully")
    void testDefaultAdminLogin() {
        LoginRequest req = new LoginRequest("admin@bizpartner.ai", "password123");
        JwtResponse response = authService.login(req);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("admin@bizpartner.ai", response.getEmail());
    }
}
