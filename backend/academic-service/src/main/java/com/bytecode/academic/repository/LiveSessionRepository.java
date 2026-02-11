package com.bytecode.academic.repository;

import com.bytecode.academic.model.LiveSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveSessionRepository extends MongoRepository<LiveSession, String> {
}
