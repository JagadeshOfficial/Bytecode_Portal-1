package com.bytecode.academic.repository;

import com.bytecode.academic.model.Curriculum;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumRepository extends MongoRepository<Curriculum, String> {
    List<Curriculum> findByCourseId(String courseId);
    Optional<Curriculum> findByCourseIdAndIsActiveTrue(String courseId);
    List<Curriculum> findByLevel(String level);
}
