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
        if (userRepository.count() <= 1) {
            // Seed more users if only Super Admin exists
            userRepository.save(com.bytecode.user.model.User.builder()
                    .fullName("Mewin")
                    .email("mewin@bytecode.com")
                    .role(com.bytecode.user.model.UserRole.SUPER_ADMIN)
                    .department("Management")
                    .userStatus("Active")
                    .checkInTime("10:00 AM")
                    .attendanceRate(100.0)
                    .active(true)
                    .build());
            userRepository.save(com.bytecode.user.model.User.builder()
                    .fullName("Dr. Aris")
                    .email("aris@bytecode.com")
                    .role(com.bytecode.user.model.UserRole.TRAINER)
                    .department("AI & Machine Learning")
                    .userStatus("In Meeting")
                    .checkInTime("10:00 AM")
                    .attendanceRate(98.0)
                    .active(true)
                    .build());
            userRepository.save(com.bytecode.user.model.User.builder()
                    .fullName("Sarah Connor")
                    .email("sarah@bytecode.com")
                    .role(com.bytecode.user.model.UserRole.HR)
                    .department("Administration")
                    .userStatus("Present")
                    .checkInTime("08:45 AM")
                    .attendanceRate(95.5)
                    .active(true)
                    .build());
            userRepository.save(com.bytecode.user.model.User.builder()
                    .fullName("Vamsi")
                    .email("vamsi@example.com")
                    .role(com.bytecode.user.model.UserRole.STUDENT)
                    .department("Computer Science")
                    .userStatus("Present")
                    .checkInTime("09:15 AM")
                    .attendanceRate(90.0)
                    .active(true)
                    .build());
            System.out.println("Seeded additional users.");
        }

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
            if (user.getAttendanceRate() == null || user.getAttendanceRate() == 0) {
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
