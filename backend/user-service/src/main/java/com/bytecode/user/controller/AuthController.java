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
        // Find user by email in our MongoDB
        return userService.getUserByEmail(request.getEmail())
                .map(user -> {
                    // Simple demo check: match hardcoded passwords for now
                    // prioritize DB password, fallback to demo password
                    String dbPassword = user.getPassword();
                    String demoPassword = getDemoPassword(request.getEmail());
                    boolean isAuthenticated = false;

                    if (dbPassword != null && !dbPassword.isEmpty()) {
                         if (dbPassword.equals(request.getPassword())) {
                             isAuthenticated = true;
                         }
                    } else if (demoPassword != null && demoPassword.equals(request.getPassword())) {
                        isAuthenticated = true;
                    }

                    if (isAuthenticated) {
                        return ResponseEntity.ok(AuthResponse.builder()
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .token("token-" + user.getRole().name().toLowerCase())
                                .status("SUCCESS")
                                .build());
                    }
                    return ResponseEntity.status(401).body(AuthResponse.builder().status("FAILED").build());
                })
                .orElse(ResponseEntity.status(401).body(AuthResponse.builder().status("FAILED").build()));
    }

    private String getDemoPassword(String email) {
        return switch (email) {
            case "director@bytecode.com" -> "masterKey_2024";
            case "admin@hyd.bytecode.com" -> "admin@123";
            case "java.trainer@bytecode.com" -> "codeIsLife!";
            case "placement.head@bytecode.com" -> "hiringNow";
            case "counselor@bytecode.com" -> "growth2024";
            case "accounts@bytecode.com" -> "moneyMatters";
            case "student@learning.com" -> "learnFast";
            default -> null;
        };
    }
}
