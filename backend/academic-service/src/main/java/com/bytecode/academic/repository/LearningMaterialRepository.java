package com.bytecode.academic.repository;

import com.bytecode.academic.model.LearningMaterial;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningMaterialRepository extends MongoRepository<LearningMaterial, String> {
    List<LearningMaterial> findByBatchId(String batchId);
    List<LearningMaterial> findByBatchIdAndFolderId(String batchId, String folderId);
    List<LearningMaterial> findByBatchIdAndFolderIdIsNull(String batchId);
}
