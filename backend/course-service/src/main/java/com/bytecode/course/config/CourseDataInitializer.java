package com.bytecode.course.config;

import com.bytecode.course.model.Course;
import com.bytecode.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class CourseDataInitializer implements CommandLineRunner {

    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (courseRepository.count() == 0) {
            List<Course> seedCourses = List.of(
                    Course.builder()
                            .title("Python Masterclass")
                            .tech("Python")
                            .duration("6 Months")
                            .description("Comprehensive Python training from basics to advanced AI/ML foundations.")
                            .price(15000.0)
                            .level("Beginner")
                            .mentor("Dr. Aris")
                            .tags(List.of("AI", "Backend", "Data Science"))
                            .active(true)
                            .build(),
                    Course.builder()
                            .title("Java FullStack Development")
                            .tech("Java, Spring Boot, React")
                            .duration("6 Months")
                            .description("Master the complete Java ecosystem with modern frontend libraries.")
                            .price(18000.0)
                            .level("Intermediate")
                            .mentor("Sudheer")
                            .tags(List.of("Enterprise", "Cloud", "SaaS"))
                            .active(true)
                            .build(),
                    Course.builder()
                            .title("UI/UX Modern Design")
                            .tech("Figma, Adobe XD")
                            .duration("3 Months")
                            .description("Learn to design high-fidelity mobile and web interfaces.")
                            .price(12000.0)
                            .level("Beginner")
                            .mentor("Irfan")
                            .tags(List.of("Design", "Creative", "Frontend"))
                            .active(true)
                            .build());
            courseRepository.saveAll(seedCourses);
            System.out.println("Initialized Course Catalog in MongoDB.");
        }
    }
}
