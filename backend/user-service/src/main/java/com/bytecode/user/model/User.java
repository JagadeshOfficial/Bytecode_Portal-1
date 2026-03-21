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
    private String branch;
    private String department;
    private String userStatus; // Present, Absent, On Leave, Remote
    private String checkInTime;
    private Double attendanceRate;
    private String password;
    private String phoneNumber;
    private String profileImage;
    private boolean active;
    private Double salary;
    private Double deductions;
    private Integer leavesTotal;
    private Integer leavesAccepted;
    private Integer leavesRejected;
    private Date createdAt;
}
