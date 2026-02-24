package com.bytecode.academic.repository;

import com.bytecode.academic.model.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchRepository extends MongoRepository<Batch, String> {
    List<Batch> findByCourseId(String courseId);

    List<Batch> findByTrainerId(String trainerId);

    List<Batch> findByStudentIdsContaining(String studentId);

    List<Batch> findByStatus(String status);

    List<Batch> findByBranch(String branch);

    List<Batch> findByBatchCode(String batchCode);
}
