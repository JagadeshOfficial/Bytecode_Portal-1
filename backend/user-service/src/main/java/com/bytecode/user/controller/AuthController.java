package com.bytecode.user.controller;

import com.bytecode.user.dto.AuthResponse;
import com.bytecode.user.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor; // Added import for RequiredArgsConstructor

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // Added RequiredArgsConstructor
public class AuthController {

    private final com.bytecode.user.service.UserService userService; // Injected UserService

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            // Check DB
            return userService.getUserByEmail(request.getEmail())
                    .map(user -> {
                        String dbPassword = user.getPassword();
                        if (dbPassword != null && dbPassword.equals(request.getPassword())) {
                            String role = user.getRole() != null ? user.getRole().name() : "STUDENT";
                             return ResponseEntity.ok(AuthResponse.builder()
                                    .email(user.getEmail())
                                    .role(role)
                                    .token("token-" + role.toLowerCase())
                                    .status("SUCCESS")
                                    .build());
                        }
                        return ResponseEntity.ok(AuthResponse.builder().status("FAILED").build());
                    })
                    .orElse(ResponseEntity.ok(AuthResponse.builder().status("FAILED").build()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(AuthResponse.builder().status("ERROR: " + e.getMessage()).build());
        }
    }

}
