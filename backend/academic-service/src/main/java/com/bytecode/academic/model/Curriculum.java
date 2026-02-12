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
@Document(collection = "curriculum")
public class Curriculum {
    @Id
    private String id;
    private String courseId;
    private String courseName;
    private String version;
    private List<Module> modules;
    private Integer totalDuration; // in hours
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private Boolean isActive;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Module {
        private String moduleId;
        private String moduleName;
        private Integer order;
        private Integer duration; // in hours
        private String description;
        private List<Topic> topics;
        private List<String> learningOutcomes;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Topic {
        private String topicId;
        private String topicName;
        private Integer order;
        private Integer duration; // in hours
        private String content;
        private List<String> resources; // URLs
        private Boolean isCompleted;
    }
}
