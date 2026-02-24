package com.bytecode.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String id; // MongoDB _id of the user
    private String email;
    private String name;
    private String role; // SUPER_ADMIN, ADMIN, TRAINER, STUDENT, etc.
    private String status;
}
