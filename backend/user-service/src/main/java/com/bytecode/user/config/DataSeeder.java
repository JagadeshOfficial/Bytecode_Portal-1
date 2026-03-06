package com.bytecode.user.config;

import com.bytecode.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        userRepository.findAll().forEach(user -> {
            boolean updated = false;
            if (user.getDepartment() == null) {
                user.setDepartment(user.getRole() == com.bytecode.user.model.UserRole.STUDENT ? "Computer Science"
                        : "Administration");
                updated = true;
            }
            if (user.getUserStatus() == null) {
                user.setUserStatus("Present");
                updated = true;
            }
            if (user.getCheckInTime() == null) {
                user.setCheckInTime("09:15 AM");
                updated = true;
            }
            if (user.getAttendanceRate() == 0) {
                user.setAttendanceRate(92.5);
                updated = true;
            }
            if (updated) {
                userRepository.save(user);
            }
        });
        System.out.println("User data enrichment completed.");
    }
}
