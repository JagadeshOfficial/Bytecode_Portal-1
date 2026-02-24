package com.bytecode.user.controller;

import com.bytecode.user.dto.AuthResponse;
import com.bytecode.user.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final com.bytecode.user.service.UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            return userService.getUserByEmail(request.getEmail())
                    .map(user -> {
                        String dbPassword = user.getPassword();
                        // Directly compare the stored password with the input
                        if (dbPassword != null && dbPassword.equals(request.getPassword())) {
                            String role = user.getRole() != null ? user.getRole().name() : "STUDENT";
                            String name = user.getFullName() != null ? user.getFullName() : user.getEmail();
                            return ResponseEntity.ok(AuthResponse.builder()
                                    .id(user.getId())
                                    .email(user.getEmail())
                                    .name(name)
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
            return ResponseEntity.internalServerError()
                    .body(AuthResponse.builder().status("ERROR: " + e.getMessage()).build());
        }
    }

    /**
     * Returns the email + password of the first user in DB that has the given role.
     * Used by the frontend "Auto-Fill" button — credentials always come from the
     * real DB,
     * never hardcoded in the frontend.
     */
    @GetMapping("/credentials/{role}")
    public ResponseEntity<?> getCredentialsForRole(@PathVariable String role) {
        try {
            List<com.bytecode.user.model.User> users = userService.getUsersByRole(role.toUpperCase());
            if (users.isEmpty()) {
                return ResponseEntity.ok(Map.of("found", false));
            }
            com.bytecode.user.model.User user = users.get(0);
            return ResponseEntity.ok(Map.of(
                    "found", true,
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "password", user.getPassword() != null ? user.getPassword() : ""));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("found", false, "error", e.getMessage()));
        }
    }
}
