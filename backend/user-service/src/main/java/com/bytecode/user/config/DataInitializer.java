package com.bytecode.user.config;

import com.bytecode.user.model.User;
import com.bytecode.user.model.UserRole;
import com.bytecode.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Date;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        List<User> demoUsers = List.of(
                User.builder().email("director@bytecode.com").fullName("Director / Super Admin")
                        .role(UserRole.SUPER_ADMIN).active(true).createdAt(new Date()).build(),
                User.builder().email("admin@hyd.bytecode.com").fullName("Hyderabad Admin").role(UserRole.ADMIN)
                        .active(true).createdAt(new Date()).build(),
                User.builder().email("java.trainer@bytecode.com").fullName("Lead Java Faculty")
                        .role(UserRole.TRAINER).active(true).createdAt(new Date()).build(),
                User.builder().email("placement.head@bytecode.com").fullName("Placement HR").role(UserRole.HR)
                        .active(true).createdAt(new Date()).build(),
                User.builder().email("counselor@bytecode.com").fullName("Student Counselor")
                        .role(UserRole.COUNSELOR).active(true).createdAt(new Date()).build(),
                User.builder().email("accounts@bytecode.com").fullName("Finance Manager").role(UserRole.FINANCE)
                        .active(true).createdAt(new Date()).build(),
                User.builder().email("student@learning.com").fullName("Demo Student").role(UserRole.STUDENT)
                        .active(true).createdAt(new Date()).build()
        );

        for (User demoUser : demoUsers) {
            if (userRepository.findByEmail(demoUser.getEmail()).isEmpty()) {
                userRepository.save(demoUser);
                System.out.println("Created user: " + demoUser.getEmail());
            }
        }
        System.out.println("Demo Users Check Complete.");
    }
}
