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
}
