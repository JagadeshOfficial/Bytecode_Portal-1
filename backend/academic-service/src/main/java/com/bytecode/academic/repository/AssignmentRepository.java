package com.bytecode.academic.repository;

import com.bytecode.academic.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    List<Assignment> findByCourseId(String courseId);
    List<Assignment> findByBatchId(String batchId);
    List<Assignment> findByTrainerId(String trainerId);
    List<Assignment> findByStatus(String status);
}
