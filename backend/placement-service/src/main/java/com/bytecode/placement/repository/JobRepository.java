package com.bytecode.placement.repository;

import com.bytecode.placement.model.JobListing;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends MongoRepository<JobListing, String> {
}
