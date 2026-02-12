package com.bytecode.user.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String fullName;
    private UserRole role; // SUPER_ADMIN, ADMIN, EMPLOYEE, STUDENT
    private String branch; // For Multi-branch management
    private String password;
    private String phoneNumber;
    private boolean active;
    private Date createdAt;
}
