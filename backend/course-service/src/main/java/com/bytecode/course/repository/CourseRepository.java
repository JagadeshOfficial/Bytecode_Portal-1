package com.bytecode.course.repository;

import com.bytecode.course.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByTechIgnoreCase(String tech);

    List<Course> findByLevel(String level);
}
