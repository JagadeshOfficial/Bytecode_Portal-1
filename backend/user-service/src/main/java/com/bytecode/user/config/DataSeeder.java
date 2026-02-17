package com.bytecode.user.config;

import com.bytecode.user.model.User;
import com.bytecode.user.model.UserRole;
import com.bytecode.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("Seeding database with demo users...");
            List<User> users = List.of(
                createUser("Director", "director@bytecode.com", "Director", UserRole.SUPER_ADMIN),
                createUser("Admin", "admin@hyd.bytecode.com", "Admin User", UserRole.ADMIN),
                createUser("Java Trainer", "java.trainer@bytecode.com", "Java Faculty", UserRole.TRAINER),
                createUser("Placement Head", "placement.head@bytecode.com", "Placement Officer", UserRole.HR),
                createUser("Counselor", "counselor@bytecode.com", "Counselor Lead", UserRole.COUNSELOR),
                createUser("Accounts", "accounts@bytecode.com", "Finance Manager", UserRole.FINANCE),
                createUser("Student", "student@learning.com", "Demo Student", UserRole.STUDENT)
            );
            userRepository.saveAll(users);
            System.out.println("Database seeded successfully with password: Bytecode@1354");
        } else {
            // Update passwords and roles for existing demo users
            List<User> existingUsers = userRepository.findAll();
            boolean updated = false;
            
            for (User user : existingUsers) {
                // Update Password if needed
                if (!"Bytecode@1354".equals(user.getPassword())) {
                    user.setPassword("Bytecode@1354");
                    updated = true;
                }
                
                // Enforce Roles for Demo Emails
                if (user.getEmail().equalsIgnoreCase("director@bytecode.com") && user.getRole() != UserRole.SUPER_ADMIN) {
                    user.setRole(UserRole.SUPER_ADMIN);
                    updated = true;
                } else if (user.getEmail().equalsIgnoreCase("admin@hyd.bytecode.com") && user.getRole() != UserRole.ADMIN) {
                    user.setRole(UserRole.ADMIN);
                    updated = true;
                }
                // (Can add others if needed, but Director is the critical one)
            }
            
            if (updated) {
                userRepository.saveAll(existingUsers);
                System.out.println("Updated passwords and roles for existing users.");
            }
        }
    }

    private User createUser(String name, String email, String fullName, UserRole role) {
        User user = new User();
        user.setFullName(fullName); // Assuming fullName matches name in my list
        user.setEmail(email);
        user.setPassword("Bytecode@1354"); // Standard password
        user.setRole(role);
        return user;
    }
}
