package com.bytecode.academic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "learning_materials")
public class LearningMaterial {
    @Id
    private String id;
    private String batchId;
    private String folderId; // null for root level
    private String name;
    private String type; // FOLDER, VIDEO, PDF, DOCUMENT, IMAGE
    private String url;
    private Long size; // in bytes
    private String uploadedBy;
    private Date uploadedAt;
    private MaterialPermissions permissions;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MaterialPermissions {
        private List<String> studentIds; // Students who have access
        private String accessType; // READ, WRITE, FULL
        private Boolean isPublic; // If true, all batch students can access
    }
}
