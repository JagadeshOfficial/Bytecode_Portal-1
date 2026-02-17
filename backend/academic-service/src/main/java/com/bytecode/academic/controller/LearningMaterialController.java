package com.bytecode.academic.controller;

import com.bytecode.academic.model.LearningMaterial;
import com.bytecode.academic.repository.LearningMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/academic/materials")
public class LearningMaterialController {

    @Autowired
    private LearningMaterialRepository materialRepository;

    @GetMapping
    public ResponseEntity<?> getAllMaterials() {
        try {
            return ResponseEntity.ok(materialRepository.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching all materials: " + e.getMessage());
        }
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<?> getMaterialsByBatch(@PathVariable String batchId) {
        try {
            return ResponseEntity.ok(materialRepository.findByBatchId(batchId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching materials for batch: " + e.getMessage());
        }
    }

    @GetMapping("/batch/{batchId}/folder/{folderId}")
    public ResponseEntity<?> getMaterialsByBatchAndFolder(
            @PathVariable String batchId,
            @PathVariable String folderId) {
        try {
            return ResponseEntity.ok(materialRepository.findByBatchIdAndFolderId(batchId, folderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching folder materials: " + e.getMessage());
        }
    }

    @GetMapping("/batch/{batchId}/root")
    public ResponseEntity<?> getRootMaterialsByBatch(@PathVariable String batchId) {
        try {
            return ResponseEntity.ok(materialRepository.findByBatchIdAndFolderIdIsNull(batchId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching root materials: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningMaterial> getMaterialById(@PathVariable String id) {
        return materialRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LearningMaterial> createMaterial(@RequestBody LearningMaterial material) {
        material.setUploadedAt(new Date());
        return ResponseEntity.ok(materialRepository.save(material));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningMaterial> updateMaterial(
            @PathVariable String id,
            @RequestBody LearningMaterial material) {
        return materialRepository.findById(id)
                .map(existing -> {
                    material.setId(id);
                    material.setUploadedAt(existing.getUploadedAt());
                    return ResponseEntity.ok(materialRepository.save(material));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable String id) {
        materialRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<LearningMaterial> updatePermissions(
            @PathVariable String id,
            @RequestBody LearningMaterial.MaterialPermissions permissions) {
        return materialRepository.findById(id)
                .map(material -> {
                    material.setPermissions(permissions);
                    return ResponseEntity.ok(materialRepository.save(material));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
