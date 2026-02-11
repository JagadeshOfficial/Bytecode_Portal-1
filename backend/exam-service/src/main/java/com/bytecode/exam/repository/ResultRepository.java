package com.bytecode.exam.repository;

import com.bytecode.exam.model.ExamResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends MongoRepository<ExamResult, String> {
    List<ExamResult> findByStudentEmail(String studentEmail);
}
