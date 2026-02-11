package com.bytecode.placement.repository;

import com.bytecode.placement.model.PlacementRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlacementRecordRepository extends MongoRepository<PlacementRecord, String> {
}
