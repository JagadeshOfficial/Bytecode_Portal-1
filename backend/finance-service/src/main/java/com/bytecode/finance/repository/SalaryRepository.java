package com.bytecode.finance.repository;

import com.bytecode.finance.model.SalaryRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRepository extends MongoRepository<SalaryRecord, String> {
}
