package com.bytecode.lead.repository;

import com.bytecode.lead.model.Lead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends MongoRepository<Lead, String> {
    List<Lead> findByAssignedCounsellorId(String counsellorId);
    List<Lead> findByStatus(Lead.LeadStatus status);
}
