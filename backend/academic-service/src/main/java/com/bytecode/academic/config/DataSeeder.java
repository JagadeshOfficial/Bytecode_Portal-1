package com.bytecode.academic.config;

import com.bytecode.academic.model.*;
import com.bytecode.academic.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

// @Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final BatchRepository batchRepository;
    private final LiveSessionRepository liveSessionRepository;
    private final AssignmentRepository assignmentRepository;
    private final CurriculumRepository curriculumRepository;
    private final AnnouncementRepository announcementRepository;
    private final NoticeRepository noticeRepository;

    @Override
    public void run(String... args) {
        log.info("Starting Academic Data Seeding...");

        // Seed data
        seedBatches();
        seedLiveSessions();
        seedAssignments();
        seedCurriculum();
        seedAnnouncements();
        seedNotices();

        log.info("Academic Data Seeding Completed!");
    }

    private void seedBatches() {
        if (batchRepository.count() > 0) {
            log.info("Batches already exist, skipping seeding");
            return;
        }

        List<Batch> batches = Arrays.asList(
                // Full Stack Development Batches
                Batch.builder()
                        .batchCode("FS-W24-01")
                        .batchName("Full Stack Winter 2024")
                        .courseId("course-fullstack")
                        .courseName("Full Stack Development")
                        .trainerId("trainer-001")
                        .trainerName("Rahul B.")
                        .startDate(getDate(-30))
                        .endDate(getDate(60))
                        .status("ONGOING")
                        .totalStudents(45)
                        .studentIds(generateStudentIds(45))
                        .schedule("Mon-Fri 10:00 AM - 12:00 PM")
                        .mode("ONLINE")
                        .branch("Hyderabad")
                        .maxCapacity(50)
                        .description("Comprehensive full stack development bootcamp covering MERN stack")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build(),

                // Data Science Batches
                Batch.builder()
                        .batchCode("DS-SP24-01")
                        .batchName("Data Science Spring 2024")
                        .courseId("course-datascience")
                        .courseName("Data Science & ML")
                        .trainerId("trainer-002")
                        .trainerName("Priya K.")
                        .startDate(getDate(-15))
                        .endDate(getDate(75))
                        .status("ONGOING")
                        .totalStudents(38)
                        .studentIds(generateStudentIds(38))
                        .schedule("Tue-Sat 02:00 PM - 04:00 PM")
                        .mode("HYBRID")
                        .branch("Bangalore")
                        .maxCapacity(40)
                        .description("Advanced data science program with hands-on ML projects")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build(),

                // AWS Cloud Batches
                Batch.builder()
                        .batchCode("AWS-CC24-01")
                        .batchName("AWS Cloud Certification 2024")
                        .courseId("course-aws")
                        .courseName("AWS Cloud Certification")
                        .trainerId("trainer-003")
                        .trainerName("Amit K.")
                        .startDate(getDate(-7))
                        .endDate(getDate(53))
                        .status("ONGOING")
                        .totalStudents(32)
                        .studentIds(generateStudentIds(32))
                        .schedule("Mon-Wed-Fri 06:00 PM - 08:00 PM")
                        .mode("ONLINE")
                        .branch("Pune")
                        .maxCapacity(35)
                        .description("Complete AWS certification preparation with practical labs")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build(),

                // DevOps Batches
                Batch.builder()
                        .batchCode("DO-W24-01")
                        .batchName("DevOps Winter 2024")
                        .courseId("course-devops")
                        .courseName("DevOps Engineering")
                        .trainerId("trainer-004")
                        .trainerName("Sanjay M.")
                        .startDate(getDate(7))
                        .endDate(getDate(97))
                        .status("UPCOMING")
                        .totalStudents(0)
                        .studentIds(new ArrayList<>())
                        .schedule("Tue-Thu-Sat 10:00 AM - 12:00 PM")
                        .mode("ONLINE")
                        .branch("Chennai")
                        .maxCapacity(40)
                        .description("Master DevOps tools and practices for modern software delivery")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build(),

                // Python Programming Batches
                Batch.builder()
                        .batchCode("PY-W24-02")
                        .batchName("Python Programming Winter 2024 - Batch 2")
                        .courseId("course-python")
                        .courseName("Python Programming")
                        .trainerId("trainer-005")
                        .trainerName("Neha S.")
                        .startDate(getDate(-45))
                        .endDate(getDate(15))
                        .status("ONGOING")
                        .totalStudents(52)
                        .studentIds(generateStudentIds(52))
                        .schedule("Mon-Wed-Fri 04:00 PM - 06:00 PM")
                        .mode("OFFLINE")
                        .branch("Hyderabad")
                        .maxCapacity(55)
                        .description("Beginner to advanced Python programming with real-world projects")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build(),

                // Java Spring Boot Batches
                Batch.builder()
                        .batchCode("JSB-SP24-01")
                        .batchName("Java Spring Boot Spring 2024")
                        .courseId("course-java-spring")
                        .courseName("Java Spring Boot")
                        .trainerId("trainer-006")
                        .trainerName("Vikram R.")
                        .startDate(getDate(-20))
                        .endDate(getDate(70))
                        .status("ONGOING")
                        .totalStudents(41)
                        .studentIds(generateStudentIds(41))
                        .schedule("Tue-Thu-Sat 11:00 AM - 01:00 PM")
                        .mode("HYBRID")
                        .branch("Bangalore")
                        .maxCapacity(45)
                        .description("Enterprise Java development with Spring Boot framework")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build());

        batchRepository.saveAll(batches);
        log.info("Seeded {} batches", batches.size());
    }

    private void seedLiveSessions() {
        if (liveSessionRepository.count() > 0) {
            log.info("Live sessions already exist, skipping seeding");
            return;
        }

        List<LiveSession> sessions = Arrays.asList(
                // Full Stack Sessions
                LiveSession.builder()
                        .title("Full Stack Winter 2024")
                        .description("Introduction to MERN Stack Architecture")
                        .mentorId("trainer-001")
                        .mentorName("Rahul B.")
                        .courseId("course-fullstack")
                        .courseName("Full Stack Development")
                        .batchId("FS-W24-01")
                        .batchName("Full Stack Winter 2024")
                        .startTime(getDateTime(0, 10, 0))
                        .endTime(getDateTime(0, 12, 0))
                        .duration(120)
                        .meetingLink("https://zoom.us/j/123456789")
                        .meetingId("123-456-789")
                        .passcode("fs2024")
                        .status("ONGOING")
                        .platform("ZOOM")
                        .topics(Arrays.asList("React Basics", "Node.js Setup", "MongoDB Integration"))
                        .recordingUrl("")
                        .totalParticipants(45)
                        .attendees(generateStudentIds(45))
                        .notes("Please complete the pre-reading assignment before the session")
                        .resources(Arrays.asList("https://reactjs.org/docs", "https://nodejs.org/docs"))
                        .createdAt(new Date())
                        .branch("Hyderabad")
                        .build(),

                LiveSession.builder()
                        .title("Data Science Spring 2024")
                        .description("Machine Learning Fundamentals")
                        .mentorId("trainer-002")
                        .mentorName("Priya K.")
                        .courseId("course-datascience")
                        .courseName("Data Science & ML")
                        .batchId("DS-SP24-01")
                        .batchName("Data Science Spring 2024")
                        .startTime(getDateTime(0, 14, 0))
                        .endTime(getDateTime(0, 16, 0))
                        .duration(120)
                        .meetingLink("https://meet.google.com/abc-defg-hij")
                        .meetingId("abc-defg-hij")
                        .passcode("ds2024")
                        .status("ONGOING")
                        .platform("GOOGLE_MEET")
                        .topics(Arrays.asList("Supervised Learning", "Linear Regression", "Model Evaluation"))
                        .recordingUrl("")
                        .totalParticipants(38)
                        .attendees(generateStudentIds(38))
                        .notes("Bring your laptops with Jupyter Notebook installed")
                        .resources(Arrays.asList("https://scikit-learn.org/stable/", "https://pandas.pydata.org/"))
                        .createdAt(new Date())
                        .branch("Bangalore")
                        .build(),

                LiveSession.builder()
                        .title("AWS Cloud Certification 2024")
                        .description("AWS EC2 and S3 Deep Dive")
                        .mentorId("trainer-003")
                        .mentorName("Amit K.")
                        .courseId("course-aws")
                        .courseName("AWS Cloud Certification")
                        .batchId("AWS-CC24-01")
                        .batchName("AWS Cloud Certification 2024")
                        .startTime(getDateTime(0, 18, 0))
                        .endTime(getDateTime(0, 20, 0))
                        .duration(120)
                        .meetingLink("https://teams.microsoft.com/l/meetup-join/xyz")
                        .meetingId("xyz-123-abc")
                        .passcode("aws2024")
                        .status("FINALIZING")
                        .platform("MS_TEAMS")
                        .topics(Arrays.asList("EC2 Instance Types", "S3 Bucket Policies", "IAM Roles"))
                        .recordingUrl("")
                        .totalParticipants(32)
                        .attendees(generateStudentIds(32))
                        .notes("AWS Free Tier account required for hands-on practice")
                        .resources(Arrays.asList("https://aws.amazon.com/ec2/", "https://aws.amazon.com/s3/"))
                        .createdAt(new Date())
                        .branch("Pune")
                        .build(),

                // Upcoming Sessions
                LiveSession.builder()
                        .title("Python Programming Winter 2024 - Batch 2")
                        .description("Advanced Python: Decorators and Generators")
                        .mentorId("trainer-005")
                        .mentorName("Neha S.")
                        .courseId("course-python")
                        .courseName("Python Programming")
                        .batchId("PY-W24-02")
                        .batchName("Python Programming Winter 2024 - Batch 2")
                        .startTime(getDateTime(1, 16, 0))
                        .endTime(getDateTime(1, 18, 0))
                        .duration(120)
                        .meetingLink("https://zoom.us/j/987654321")
                        .meetingId("987-654-321")
                        .passcode("py2024")
                        .status("UPCOMING")
                        .platform("ZOOM")
                        .topics(Arrays.asList("Decorators", "Generators", "Context Managers"))
                        .recordingUrl("")
                        .totalParticipants(0)
                        .attendees(new ArrayList<>())
                        .notes("Review the previous session on functions before attending")
                        .resources(Arrays.asList("https://docs.python.org/3/tutorial/"))
                        .createdAt(new Date())
                        .branch("Hyderabad")
                        .build(),

                LiveSession.builder()
                        .title("Java Spring Boot Spring 2024")
                        .description("Spring Security and JWT Authentication")
                        .mentorId("trainer-006")
                        .mentorName("Vikram R.")
                        .courseId("course-java-spring")
                        .courseName("Java Spring Boot")
                        .batchId("JSB-SP24-01")
                        .batchName("Java Spring Boot Spring 2024")
                        .startTime(getDateTime(2, 11, 0))
                        .endTime(getDateTime(2, 13, 0))
                        .duration(120)
                        .meetingLink("https://meet.google.com/spring-security-jwt")
                        .meetingId("spring-sec-jwt")
                        .passcode("jsb2024")
                        .status("UPCOMING")
                        .platform("GOOGLE_MEET")
                        .topics(Arrays.asList("Spring Security Basics", "JWT Token Generation", "Role-Based Access"))
                        .recordingUrl("")
                        .totalParticipants(0)
                        .attendees(new ArrayList<>())
                        .notes("Complete the Spring Boot basics module before this session")
                        .resources(Arrays.asList("https://spring.io/projects/spring-security"))
                        .createdAt(new Date())
                        .branch("Bangalore")
                        .build());

        liveSessionRepository.saveAll(sessions);
        log.info("Seeded {} live sessions", sessions.size());
    }

    private void seedAssignments() {
        if (assignmentRepository.count() > 0) {
            log.info("Assignments already exist, skipping seeding");
            return;
        }

        List<Assignment> assignments = Arrays.asList(
                Assignment.builder()
                        .title("Build a Todo App with MERN Stack")
                        .description("Create a full-stack todo application using MongoDB, Express, React, and Node.js")
                        .courseId("course-fullstack")
                        .courseName("Full Stack Development")
                        .batchId("FS-W24-01")
                        .batchName("Full Stack Winter 2024")
                        .trainerId("trainer-001")
                        .trainerName("Rahul B.")
                        .assignedDate(getDate(-5))
                        .dueDate(getDate(7))
                        .totalMarks(100)
                        .difficulty("MEDIUM")
                        .attachments(Arrays.asList("https://docs.google.com/document/d/assignment-brief"))
                        .instructions("Implement CRUD operations, user authentication, and responsive UI")
                        .submissions(new ArrayList<>())
                        .status("ACTIVE")
                        .createdAt(getDate(-5))
                        .build(),

                Assignment.builder()
                        .title("Linear Regression Model for House Price Prediction")
                        .description("Build a machine learning model to predict house prices using linear regression")
                        .courseId("course-datascience")
                        .courseName("Data Science & ML")
                        .batchId("DS-SP24-01")
                        .batchName("Data Science Spring 2024")
                        .trainerId("trainer-002")
                        .trainerName("Priya K.")
                        .assignedDate(getDate(-3))
                        .dueDate(getDate(10))
                        .totalMarks(100)
                        .difficulty("HARD")
                        .attachments(Arrays.asList("https://drive.google.com/file/d/dataset.csv"))
                        .instructions(
                                "Use scikit-learn, perform data preprocessing, feature engineering, and model evaluation")
                        .submissions(new ArrayList<>())
                        .status("ACTIVE")
                        .createdAt(getDate(-3))
                        .build(),

                Assignment.builder()
                        .title("Deploy a Static Website on AWS S3")
                        .description("Host a static website using AWS S3 and CloudFront")
                        .courseId("course-aws")
                        .courseName("AWS Cloud Certification")
                        .batchId("AWS-CC24-01")
                        .batchName("AWS Cloud Certification 2024")
                        .trainerId("trainer-003")
                        .trainerName("Amit K.")
                        .assignedDate(getDate(-2))
                        .dueDate(getDate(5))
                        .totalMarks(50)
                        .difficulty("EASY")
                        .attachments(
                                Arrays.asList("https://aws.amazon.com/getting-started/hands-on/host-static-website/"))
                        .instructions(
                                "Create S3 bucket, configure static website hosting, and set up CloudFront distribution")
                        .submissions(new ArrayList<>())
                        .status("ACTIVE")
                        .createdAt(getDate(-2))
                        .build(),

                Assignment.builder()
                        .title("Python Web Scraper for E-commerce")
                        .description("Build a web scraper to extract product data from an e-commerce website")
                        .courseId("course-python")
                        .courseName("Python Programming")
                        .batchId("PY-W24-02")
                        .batchName("Python Programming Winter 2024 - Batch 2")
                        .trainerId("trainer-005")
                        .trainerName("Neha S.")
                        .assignedDate(getDate(-7))
                        .dueDate(getDate(0))
                        .totalMarks(75)
                        .difficulty("MEDIUM")
                        .attachments(Arrays.asList("https://docs.python-requests.org/",
                                "https://www.crummy.com/software/BeautifulSoup/"))
                        .instructions(
                                "Use BeautifulSoup and Requests library, handle pagination, and store data in CSV")
                        .submissions(new ArrayList<>())
                        .status("CLOSED")
                        .createdAt(getDate(-7))
                        .build(),

                Assignment.builder()
                        .title("RESTful API with Spring Boot")
                        .description("Create a RESTful API for a library management system")
                        .courseId("course-java-spring")
                        .courseName("Java Spring Boot")
                        .batchId("JSB-SP24-01")
                        .batchName("Java Spring Boot Spring 2024")
                        .trainerId("trainer-006")
                        .trainerName("Vikram R.")
                        .assignedDate(getDate(-4))
                        .dueDate(getDate(8))
                        .totalMarks(100)
                        .difficulty("HARD")
                        .attachments(Arrays.asList("https://spring.io/guides/tutorials/rest/"))
                        .instructions(
                                "Implement CRUD operations, exception handling, validation, and Swagger documentation")
                        .submissions(new ArrayList<>())
                        .status("ACTIVE")
                        .createdAt(getDate(-4))
                        .build());

        assignmentRepository.saveAll(assignments);
        log.info("Seeded {} assignments", assignments.size());
    }

    private void seedCurriculum() {
        if (curriculumRepository.count() > 0) {
            log.info("Curriculum already exists, skipping seeding");
            return;
        }

        List<Curriculum> curriculums = Arrays.asList(
                // Full Stack Development Curriculum
                Curriculum.builder()
                        .courseId("course-fullstack")
                        .courseName("Full Stack Development")
                        .version("v2.0")
                        .modules(Arrays.asList(
                                Curriculum.Module.builder()
                                        .moduleId("mod-1")
                                        .moduleName("Frontend Development with React")
                                        .order(1)
                                        .duration(40)
                                        .description("Master React.js for building modern user interfaces")
                                        .topics(Arrays.asList(
                                                Curriculum.Topic.builder().topicId("t1").topicName("React Basics")
                                                        .order(1).duration(8).content("Components, Props, State")
                                                        .resources(Arrays.asList("https://reactjs.org/docs"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t2").topicName("React Hooks")
                                                        .order(2).duration(8).content("useState, useEffect, useContext")
                                                        .resources(Arrays
                                                                .asList("https://reactjs.org/docs/hooks-intro.html"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t3").topicName("React Router")
                                                        .order(3).duration(6).content("Client-side routing")
                                                        .resources(Arrays.asList("https://reactrouter.com/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t4").topicName("State Management")
                                                        .order(4).duration(10).content("Redux, Context API")
                                                        .resources(Arrays.asList("https://redux.js.org/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t5").topicName("API Integration")
                                                        .order(5).duration(8).content("Axios, Fetch API")
                                                        .resources(Arrays.asList("https://axios-http.com/"))
                                                        .isCompleted(false).build()))
                                        .learningOutcomes(Arrays.asList("Build responsive UIs",
                                                "Manage application state", "Integrate with REST APIs"))
                                        .build(),
                                Curriculum.Module.builder()
                                        .moduleId("mod-2")
                                        .moduleName("Backend Development with Node.js")
                                        .order(2)
                                        .duration(35)
                                        .description("Build scalable backend services with Node.js and Express")
                                        .topics(Arrays.asList(
                                                Curriculum.Topic.builder().topicId("t6")
                                                        .topicName("Node.js Fundamentals").order(1).duration(8)
                                                        .content("Event Loop, Modules, NPM")
                                                        .resources(Arrays.asList("https://nodejs.org/docs"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t7")
                                                        .topicName("Express.js Framework").order(2).duration(10)
                                                        .content("Routing, Middleware, Error Handling")
                                                        .resources(Arrays.asList("https://expressjs.com/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t8").topicName("RESTful API Design")
                                                        .order(3).duration(8)
                                                        .content("HTTP Methods, Status Codes, Best Practices")
                                                        .resources(Arrays.asList()).isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t9")
                                                        .topicName("Authentication & Authorization").order(4)
                                                        .duration(9).content("JWT, OAuth, Session Management")
                                                        .resources(Arrays.asList("https://jwt.io/")).isCompleted(false)
                                                        .build()))
                                        .learningOutcomes(Arrays.asList("Create RESTful APIs",
                                                "Implement authentication", "Handle errors gracefully"))
                                        .build(),
                                Curriculum.Module.builder()
                                        .moduleId("mod-3")
                                        .moduleName("Database Management with MongoDB")
                                        .order(3)
                                        .duration(25)
                                        .description("Work with NoSQL databases using MongoDB")
                                        .topics(Arrays.asList(
                                                Curriculum.Topic.builder().topicId("t10").topicName("MongoDB Basics")
                                                        .order(1).duration(6)
                                                        .content("Collections, Documents, CRUD Operations")
                                                        .resources(Arrays.asList("https://www.mongodb.com/docs/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t11").topicName("Mongoose ODM")
                                                        .order(2).duration(8).content("Schemas, Models, Validation")
                                                        .resources(Arrays.asList("https://mongoosejs.com/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t12").topicName("Advanced Queries")
                                                        .order(3).duration(6)
                                                        .content("Aggregation, Indexing, Performance")
                                                        .resources(Arrays.asList()).isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("t13").topicName("Database Design")
                                                        .order(4).duration(5).content("Schema Design, Relationships")
                                                        .resources(Arrays.asList()).isCompleted(false).build()))
                                        .learningOutcomes(Arrays.asList("Design database schemas",
                                                "Perform complex queries", "Optimize database performance"))
                                        .build()))
                        .totalDuration(100)
                        .level("INTERMEDIATE")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .createdBy("admin")
                        .isActive(true)
                        .build(),

                // Data Science Curriculum
                Curriculum.builder()
                        .courseId("course-datascience")
                        .courseName("Data Science & ML")
                        .version("v1.5")
                        .modules(Arrays.asList(
                                Curriculum.Module.builder()
                                        .moduleId("ds-mod-1")
                                        .moduleName("Python for Data Science")
                                        .order(1)
                                        .duration(30)
                                        .description("Master Python libraries for data analysis")
                                        .topics(Arrays.asList(
                                                Curriculum.Topic.builder().topicId("ds-t1").topicName("NumPy").order(1)
                                                        .duration(8).content("Arrays, Operations, Broadcasting")
                                                        .resources(Arrays.asList("https://numpy.org/doc/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("ds-t2").topicName("Pandas").order(2)
                                                        .duration(12).content("DataFrames, Data Cleaning, Manipulation")
                                                        .resources(Arrays.asList("https://pandas.pydata.org/docs/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("ds-t3")
                                                        .topicName("Matplotlib & Seaborn").order(3).duration(10)
                                                        .content("Data Visualization")
                                                        .resources(Arrays.asList("https://matplotlib.org/",
                                                                "https://seaborn.pydata.org/"))
                                                        .isCompleted(false).build()))
                                        .learningOutcomes(Arrays.asList("Analyze data with Python",
                                                "Create visualizations", "Clean and preprocess data"))
                                        .build(),
                                Curriculum.Module.builder()
                                        .moduleId("ds-mod-2")
                                        .moduleName("Machine Learning Fundamentals")
                                        .order(2)
                                        .duration(40)
                                        .description("Learn core ML algorithms and techniques")
                                        .topics(Arrays.asList(
                                                Curriculum.Topic.builder().topicId("ds-t4")
                                                        .topicName("Supervised Learning").order(1).duration(15)
                                                        .content("Regression, Classification")
                                                        .resources(Arrays.asList("https://scikit-learn.org/"))
                                                        .isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("ds-t5")
                                                        .topicName("Unsupervised Learning").order(2).duration(12)
                                                        .content("Clustering, Dimensionality Reduction")
                                                        .resources(Arrays.asList()).isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("ds-t6")
                                                        .topicName("Model Evaluation").order(3).duration(8)
                                                        .content("Metrics, Cross-Validation, Hyperparameter Tuning")
                                                        .resources(Arrays.asList()).isCompleted(false).build(),
                                                Curriculum.Topic.builder().topicId("ds-t7")
                                                        .topicName("Feature Engineering").order(4).duration(5)
                                                        .content("Feature Selection, Transformation")
                                                        .resources(Arrays.asList()).isCompleted(false).build()))
                                        .learningOutcomes(Arrays.asList("Build ML models", "Evaluate model performance",
                                                "Optimize models"))
                                        .build()))
                        .totalDuration(70)
                        .level("ADVANCED")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .createdBy("admin")
                        .isActive(true)
                        .build());

        curriculumRepository.saveAll(curriculums);
        log.info("Seeded {} curriculum records", curriculums.size());
    }

    private void seedAnnouncements() {
        if (announcementRepository.count() > 0) {
            log.info("Announcements already exist, skipping seeding");
            return;
        }

        List<Announcement> announcements = Arrays.asList(
                Announcement.builder()
                        .title("🎉 New Batch Starting: DevOps Engineering")
                        .content(
                                "We are excited to announce a new batch for DevOps Engineering starting from next week. Limited seats available!")
                        .type("EVENT")
                        .priority("HIGH")
                        .targetAudience("ALL")
                        .targetBatchIds(new ArrayList<>())
                        .targetCourseIds(new ArrayList<>())
                        .createdBy("admin-001")
                        .createdByName("Admin Team")
                        .createdAt(getDate(-2))
                        .expiryDate(getDate(30))
                        .isPinned(true)
                        .attachments(Arrays.asList())
                        .viewCount(0)
                        .branch("All Branches")
                        .build(),

                Announcement.builder()
                        .title("🏖️ Holiday Notice: Republic Day")
                        .content(
                                "The institute will remain closed on 26th January 2024 for Republic Day. All classes scheduled for that day are postponed.")
                        .type("HOLIDAY")
                        .priority("CRITICAL")
                        .targetAudience("ALL")
                        .targetBatchIds(new ArrayList<>())
                        .targetCourseIds(new ArrayList<>())
                        .createdBy("admin-001")
                        .createdByName("Admin Team")
                        .createdAt(getDate(-10))
                        .expiryDate(getDate(-5))
                        .isPinned(false)
                        .attachments(Arrays.asList())
                        .viewCount(0)
                        .branch("All Branches")
                        .build(),

                Announcement.builder()
                        .title("📝 Assignment Deadline Extension")
                        .content(
                                "The deadline for the MERN Stack Todo App assignment has been extended by 3 days due to technical issues.")
                        .type("GENERAL")
                        .priority("MEDIUM")
                        .targetAudience("SPECIFIC_BATCH")
                        .targetBatchIds(Arrays.asList("FS-W24-01"))
                        .targetCourseIds(Arrays.asList("course-fullstack"))
                        .createdBy("trainer-001")
                        .createdByName("Rahul B.")
                        .createdAt(getDate(-1))
                        .expiryDate(getDate(7))
                        .isPinned(false)
                        .attachments(Arrays.asList())
                        .viewCount(0)
                        .branch("Hyderabad")
                        .build(),

                Announcement.builder()
                        .title("🎓 Placement Drive: Top Tech Companies")
                        .content(
                                "A placement drive is scheduled for next month with top tech companies. Students from Full Stack, Data Science, and AWS batches are eligible.")
                        .type("EVENT")
                        .priority("HIGH")
                        .targetAudience("STUDENTS")
                        .targetBatchIds(Arrays.asList("FS-W24-01", "DS-SP24-01", "AWS-CC24-01"))
                        .targetCourseIds(Arrays.asList())
                        .createdBy("hr-001")
                        .createdByName("Placement Team")
                        .createdAt(getDate(-3))
                        .expiryDate(getDate(25))
                        .isPinned(true)
                        .attachments(Arrays.asList("https://drive.google.com/file/d/placement-companies-list"))
                        .viewCount(0)
                        .branch("All Branches")
                        .build(),

                Announcement.builder()
                        .title("⚠️ System Maintenance Notice")
                        .content(
                                "The learning portal will undergo scheduled maintenance on Sunday from 2 AM to 6 AM. Services will be temporarily unavailable.")
                        .type("URGENT")
                        .priority("CRITICAL")
                        .targetAudience("ALL")
                        .targetBatchIds(new ArrayList<>())
                        .targetCourseIds(new ArrayList<>())
                        .createdBy("admin-001")
                        .createdByName("IT Team")
                        .createdAt(getDate(-5))
                        .expiryDate(getDate(2))
                        .isPinned(true)
                        .attachments(Arrays.asList())
                        .viewCount(0)
                        .branch("All Branches")
                        .build());

        announcementRepository.saveAll(announcements);
        log.info("Seeded {} announcements", announcements.size());
    }

    private void seedNotices() {
        if (noticeRepository.count() > 0) {
            log.info("Notices already exist, skipping seeding");
            return;
        }

        List<Notice> notices = Arrays.asList(
                Notice.builder()
                        .title("Fee Payment Reminder")
                        .content("Please clear your pending fees by the end of this month to avoid late fees.")
                        .priority("HIGH")
                        .targetAudience("STUDENTS")
                        .createdBy("finance-team")
                        .createdAt(getDate(-3))
                        .expiryDate(getDate(27))
                        .isActive(true)
                        .build(),

                Notice.builder()
                        .title("Guest Lecture: Industry Expert Session")
                        .content(
                                "Join us for a guest lecture by a senior software architect from Google on Saturday at 3 PM.")
                        .priority("MEDIUM")
                        .targetAudience("ALL")
                        .createdBy("academic-team")
                        .createdAt(getDate(-1))
                        .expiryDate(getDate(5))
                        .isActive(true)
                        .build(),

                Notice.builder()
                        .title("Feedback Survey")
                        .content(
                                "Please take a moment to fill out the course feedback survey. Your input helps us improve.")
                        .priority("LOW")
                        .targetAudience("STUDENTS")
                        .createdBy("admin-team")
                        .createdAt(getDate(-7))
                        .expiryDate(getDate(7))
                        .isActive(true)
                        .build());

        noticeRepository.saveAll(notices);
        log.info("Seeded {} notices", notices.size());
    }

    // Helper Methods
    private Date getDate(int daysOffset) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, daysOffset);
        return cal.getTime();
    }

    private Date getDateTime(int daysOffset, int hour, int minute) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, daysOffset);
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, minute);
        cal.set(Calendar.SECOND, 0);
        return cal.getTime();
    }

    private List<String> generateStudentIds(int count) {
        List<String> ids = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            ids.add("student-" + String.format("%03d", i));
        }
        return ids;
    }
}
