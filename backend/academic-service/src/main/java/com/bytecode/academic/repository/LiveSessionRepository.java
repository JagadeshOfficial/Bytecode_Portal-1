package com.bytecode.academic.repository;

import com.bytecode.academic.model.LiveSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiveSessionRepository extends MongoRepository<LiveSession, String> {
    List<LiveSession> findByBatchId(String batchId);
    List<LiveSession> findByStatus(String status);
    List<LiveSession> findByCourseId(String courseId);
    List<LiveSession> findByMentorId(String mentorId);
}
