package com.bytecode.course.service;

import com.bytecode.course.model.Course;
import com.bytecode.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByTech(String tech) {
        return courseRepository.findByTechIgnoreCase(tech);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(String id, Course course) {
        Course existing = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        existing.setTitle(course.getTitle());
        existing.setTech(course.getTech());
        existing.setDuration(course.getDuration());
        existing.setDescription(course.getDescription());
        existing.setPrice(course.getPrice());
        existing.setImage(course.getImage());
        existing.setTags(course.getTags());
        existing.setLevel(course.getLevel());
        existing.setMentor(course.getMentor());
        existing.setModules(course.getModules());
        existing.setActive(course.isActive());
        return courseRepository.save(existing);
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
}
