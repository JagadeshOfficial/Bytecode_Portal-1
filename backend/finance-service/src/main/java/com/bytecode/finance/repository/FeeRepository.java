package com.bytecode.finance.repository;

import com.bytecode.finance.model.FeeRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeRepository extends MongoRepository<FeeRecord, String> {
}
