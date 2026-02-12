package com.bytecode.academic.config;

import com.bytecode.academic.model.*;
import com.bytecode.academic.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class ComprehensiveDataSeeder implements CommandLineRunner {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private LiveSessionRepository liveSessionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private LearningMaterialRepository learningMaterialRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String API_GATEWAY_URL = "http://localhost:8080/api";
    private static final String USER_SERVICE_URL = API_GATEWAY_URL + "/users";
    private static final String COURSE_SERVICE_URL = API_GATEWAY_URL + "/courses";

    @Override
    public void run(String... args) {
        log.info("🚀 Starting Comprehensive Data Seeder...");

        try {
            // Fetch real users from user-service
            List<UserDTO> allUsers = fetchUsersFromService();
            List<UserDTO> students = allUsers.stream()
                    .filter(u -> "STUDENT".equalsIgnoreCase(u.getRole()))
                    .collect(Collectors.toList());
            List<UserDTO> trainers = allUsers.stream()
                    .filter(u -> "TRAINER".equalsIgnoreCase(u.getRole()))
                    .collect(Collectors.toList());

            log.info("✅ Found {} students and {} trainers", students.size(), trainers.size());

            // Fetch real courses from course-service
            List<CourseDTO> courses = fetchCoursesFromService();
            log.info("✅ Found {} courses", courses.size());

            if (courses.isEmpty()) {
                log.warn("⚠️ No courses found. Please create courses first.");
                return;
            }

            if (students.isEmpty() || trainers.isEmpty()) {
                log.warn("⚠️ Not enough users. Need at least 1 student and 1 trainer.");
                return;
            }

            // Clear existing data
            batchRepository.deleteAll();
            liveSessionRepository.deleteAll();
            assignmentRepository.deleteAll();
            learningMaterialRepository.deleteAll();

            // Create 2 batches per course
            for (CourseDTO course : courses) {
                createBatchesForCourse(course, students, trainers);
            }

            log.info("✅ Comprehensive Data Seeding Completed Successfully!");

        } catch (Exception e) {
            log.error("❌ Error during data seeding: {}", e.getMessage(), e);
        }
    }

    private void createBatchesForCourse(CourseDTO course, List<UserDTO> students, List<UserDTO> trainers) {
        log.info("📚 Creating batches for course: {}", course.getTitle());

        // Create 2 batches per course
        for (int i = 1; i <= 2; i++) {
            // Select random trainer
            UserDTO trainer = trainers.get(new Random().nextInt(trainers.size()));

            // Select random students (5-10 students per batch)
            int studentCount = 5 + new Random().nextInt(6); // 5 to 10 students
            List<UserDTO> batchStudents = new ArrayList<>();
            List<UserDTO> shuffledStudents = new ArrayList<>(students);
            Collections.shuffle(shuffledStudents);
            for (int j = 0; j < Math.min(studentCount, shuffledStudents.size()); j++) {
                batchStudents.add(shuffledStudents.get(j));
            }

            // Create batch
            Batch batch = createBatch(course, trainer, batchStudents, i);
            log.info("  ✅ Created batch: {} with {} students", batch.getBatchName(), batchStudents.size());

            // Create sessions for batch
            createSessionsForBatch(batch, trainer);

            // Create assignments for batch
            createAssignmentsForBatch(batch, trainer);

            // Create learning materials with permissions
            createLearningMaterialsForBatch(batch, batchStudents);
        }
    }

    private Batch createBatch(CourseDTO course, UserDTO trainer, List<UserDTO> students, int batchNumber) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = now.plusDays(batchNumber * 7);
        LocalDateTime endDate = startDate.plusMonths(4);

        List<String> studentIds = students.stream().map(UserDTO::getId).collect(Collectors.toList());

        Batch batch = Batch.builder()
                .batchCode("BATCH-" + course.getId().substring(0, 4).toUpperCase() + "-" + batchNumber)
                .batchName(course.getTitle() + " - Batch " + batchNumber)
                .courseId(course.getId())
                .courseName(course.getTitle())
                .trainerId(trainer.getId())
                .trainerName(trainer.getFullName())
                .startDate(Date.from(startDate.atZone(ZoneId.systemDefault()).toInstant()))
                .endDate(Date.from(endDate.atZone(ZoneId.systemDefault()).toInstant()))
                .status(batchNumber == 1 ? "ONGOING" : "UPCOMING")
                .totalStudents(students.size())
                .studentIds(studentIds)
                .schedule(batchNumber == 1 ? "Mon-Fri 10:00 AM - 12:00 PM" : "Mon-Fri 2:00 PM - 4:00 PM")
                .mode(batchNumber == 1 ? "ONLINE" : "HYBRID")
                .branch("Main Campus")
                .maxCapacity(30)
                .build();

        return batchRepository.save(batch);
    }

    private void createSessionsForBatch(Batch batch, UserDTO trainer) {
        String[] sessionTopics = {
                "Introduction & Course Overview",
                "Core Concepts - Part 1",
                "Core Concepts - Part 2",
                "Hands-on Workshop",
                "Advanced Topics",
                "Project Discussion"
        };

        LocalDateTime sessionStart = LocalDateTime.now().minusDays(7);

        for (int i = 0; i < 6; i++) {
            sessionStart = sessionStart.plusDays(2);
            LocalDateTime sessionEnd = sessionStart.plusHours(2);

            String status;
            if (sessionStart.isBefore(LocalDateTime.now().minusDays(1))) {
                status = "COMPLETED";
            } else if (sessionStart.isBefore(LocalDateTime.now().plusHours(1)) && 
                       sessionStart.isAfter(LocalDateTime.now().minusHours(1))) {
                status = "ONGOING";
            } else {
                status = "UPCOMING";
            }

            LiveSession session = LiveSession.builder()
                    .title(sessionTopics[i])
                    .description("Comprehensive session covering " + sessionTopics[i].toLowerCase())
                    .mentorName(trainer.getFullName())
                    .courseName(batch.getCourseName())
                    .batchId(batch.getId())
                    .batchName(batch.getBatchName())
                    .startTime(Date.from(sessionStart.atZone(ZoneId.systemDefault()).toInstant()))
                    .endTime(Date.from(sessionEnd.atZone(ZoneId.systemDefault()).toInstant()))
                    .duration(120)
                    .meetingLink("https://meet.google.com/" + UUID.randomUUID().toString().substring(0, 10))
                    .status(status)
                    .platform("Google Meet")
                    .totalParticipants(batch.getTotalStudents())
                    .build();

            liveSessionRepository.save(session);
        }

        log.info("    ✅ Created 6 sessions for batch: {}", batch.getBatchName());
    }

    private void createAssignmentsForBatch(Batch batch, UserDTO trainer) {
        String[] assignmentTitles = {
                "Module 1 - Fundamentals Assignment",
                "Module 2 - Practical Exercise",
                "Mid-term Project",
                "Advanced Concepts Assignment",
                "Final Project"
        };

        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);

        for (int i = 0; i < 5; i++) {
            dueDate = dueDate.plusDays(7);

            Assignment assignment = Assignment.builder()
                    .title(assignmentTitles[i])
                    .description("Complete the " + assignmentTitles[i].toLowerCase() + " as discussed in class")
                    .courseName(batch.getCourseName())
                    .batchId(batch.getId())
                    .batchName(batch.getBatchName())
                    .trainerName(trainer.getFullName())
                    .assignedDate(new Date())
                    .dueDate(Date.from(dueDate.atZone(ZoneId.systemDefault()).toInstant()))
                    .totalMarks(i < 2 ? 50 : 100)
                    .difficulty(i < 2 ? "EASY" : i < 4 ? "MEDIUM" : "HARD")
                    .status(i < 3 ? "ACTIVE" : "UPCOMING")
                    .build();

            assignmentRepository.save(assignment);
        }

        log.info("    ✅ Created 5 assignments for batch: {}", batch.getBatchName());
    }

    private void createLearningMaterialsForBatch(Batch batch, List<UserDTO> students) {
        // Create 2 folders
        LearningMaterial folder1 = createFolder(batch, "Week 1-2 Materials", students, true);
        LearningMaterial folder2 = createFolder(batch, "Week 3-4 Materials", students, false);

        // Create 2 files in root (accessible to all)
        createFile(batch, null, "Course Syllabus.pdf", "PDF", 
                "https://example.com/syllabus.pdf", students, true);
        createFile(batch, null, "Introduction Video.mp4", "VIDEO", 
                "https://example.com/intro-video.mp4", students, true);

        // Create files in folder1 (full access to all)
        createFile(batch, folder1.getId(), "Lecture 1 Notes.pdf", "PDF", 
                "https://example.com/lecture1.pdf", students, true);
        createFile(batch, folder1.getId(), "Lecture 1 Recording.mp4", "VIDEO", 
                "https://example.com/lecture1.mp4", students, true);

        // Create files in folder2 (restricted access - only some students)
        List<UserDTO> restrictedStudents = students.subList(0, Math.min(3, students.size()));
        createFile(batch, folder2.getId(), "Advanced Topics.pdf", "PDF", 
                "https://example.com/advanced.pdf", restrictedStudents, false);
        createFile(batch, folder2.getId(), "Advanced Demo.mp4", "VIDEO", 
                "https://example.com/advanced-demo.mp4", restrictedStudents, false);

        log.info("    ✅ Created 2 folders and 6 files with granular permissions for batch: {}", batch.getBatchName());
    }

    private LearningMaterial createFolder(Batch batch, String name, List<UserDTO> students, boolean isPublic) {
        List<String> studentIds = students.stream().map(UserDTO::getId).collect(Collectors.toList());

        LearningMaterial.MaterialPermissions permissions = LearningMaterial.MaterialPermissions.builder()
                .studentIds(isPublic ? studentIds : studentIds.subList(0, Math.min(3, studentIds.size())))
                .accessType("FULL")
                .isPublic(isPublic)
                .build();

        LearningMaterial folder = LearningMaterial.builder()
                .batchId(batch.getId())
                .folderId(null) // Root level
                .name(name)
                .type("FOLDER")
                .uploadedBy(batch.getTrainerName())
                .uploadedAt(new Date())
                .permissions(permissions)
                .build();

        return learningMaterialRepository.save(folder);
    }

    private void createFile(Batch batch, String folderId, String name, String type, 
                           String url, List<UserDTO> students, boolean isPublic) {
        List<String> studentIds = students.stream().map(UserDTO::getId).collect(Collectors.toList());

        LearningMaterial.MaterialPermissions permissions = LearningMaterial.MaterialPermissions.builder()
                .studentIds(studentIds)
                .accessType(isPublic ? "FULL" : "READ")
                .isPublic(isPublic)
                .build();

        LearningMaterial file = LearningMaterial.builder()
                .batchId(batch.getId())
                .folderId(folderId)
                .name(name)
                .type(type)
                .url(url)
                .size((long) (1024 * 1024 * (1 + new Random().nextInt(10)))) // 1-10 MB
                .uploadedBy(batch.getTrainerName())
                .uploadedAt(new Date())
                .permissions(permissions)
                .build();

        learningMaterialRepository.save(file);
    }

    private List<UserDTO> fetchUsersFromService() {
        try {
            ResponseEntity<List<UserDTO>> response = restTemplate.exchange(
                    USER_SERVICE_URL,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<UserDTO>>() {}
            );
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            log.error("Failed to fetch users from user-service: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<CourseDTO> fetchCoursesFromService() {
        try {
            ResponseEntity<List<CourseDTO>> response = restTemplate.exchange(
                    COURSE_SERVICE_URL,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<CourseDTO>>() {}
            );
            return response.getBody() != null ? response.getBody() : new ArrayList<>();
        } catch (Exception e) {
            log.error("Failed to fetch courses from course-service: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    // DTOs for external services
    @lombok.Data
    static class UserDTO {
        private String id;
        private String fullName;
        private String email;
        private String role;
    }

    @lombok.Data
    static class CourseDTO {
        private String id;
        private String title;
        private String description;
        private String category;
    }
}
